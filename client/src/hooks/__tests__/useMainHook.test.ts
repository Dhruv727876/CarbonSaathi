import { renderHook, act } from '@testing-library/react';
import { useMainHook } from '../useMainHook';
import { initializeUserSession, getDoc } from '../../firebase';

// Mock Firebase SDK module using path relative to this test file
jest.mock('../../firebase', () => {
  return {
    db: {},
    initializeUserSession: jest.fn(),
    logCarbonEvent: jest.fn(),
    doc: jest.fn(),
    setDoc: jest.fn(),
    getDoc: jest.fn()
  };
});

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useMainHook hook validation suite', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    jest.clearAllMocks();
    (initializeUserSession as jest.Mock).mockImplementation(() => Promise.resolve('mock-uid'));
    (getDoc as jest.Mock).mockImplementation(() => Promise.resolve({
      exists: () => false
    }));
  });

  it('initial state has empty messages and isLoading false', async () => {
    const { result } = renderHook(() => useMainHook());
    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('sendMessage updates messages array after response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ responseText: 'Reduce carbon today.', suggestedAction: 'Plant trees.', sources: ['moef.gov.in'] })
    });

    const { result } = renderHook(() => useMainHook());

    await act(async () => {
      await result.current.sendMessage('How to reduce footprint?');
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].sender).toBe('user');
    expect(result.current.messages[1].sender).toBe('ai');
    expect(result.current.messages[1].text).toBe('Reduce carbon today.');
  });

  it('sendMessage sets error state on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useMainHook());

    await act(async () => {
      await result.current.sendMessage('Any tips?');
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.isLoading).toBe(false);
  });

  it('sendMessage does not call fetch when message is empty string', async () => {
    const { result } = renderHook(() => useMainHook());

    await act(async () => {
      await result.current.sendMessage('   ');
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('bustMyth calls /api/mythbust endpoint with correct payload', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ responseText: 'This is a myth.', suggestedAction: 'Action.', sources: ['moef.gov.in'] })
    });

    const { result } = renderHook(() => useMainHook());

    await act(async () => {
      await result.current.bustMyth('Myth string');
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchArgs = mockFetch.mock.calls[0];
    expect(fetchArgs[0]).toContain('/api/mythbust');
    const requestBody = JSON.parse(fetchArgs[1].body);
    expect(requestBody.myth).toBe('Myth string');
  });

  it('error state resets on next successful sendMessage', async () => {
    mockFetch.mockRejectedValueOnce(new Error('First failure'));

    const { result } = renderHook(() => useMainHook());

    await act(async () => {
      await result.current.sendMessage('Fail me');
    });
    expect(result.current.error).toBe('First failure');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ responseText: 'Success', suggestedAction: 'Action', sources: ['moef.gov.in'] })
    });

    await act(async () => {
      await result.current.sendMessage('Succeed me');
    });

    expect(result.current.error).toBeNull();
  });

  it('isLoading is true during fetch and false after completion', async () => {
    let resolvePromise: (value: unknown) => void = (_unused: unknown) => undefined;
    const fetchPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockFetch.mockImplementationOnce(() => fetchPromise);

    const { result } = renderHook(() => useMainHook());

    let actPromise;
    act(() => {
      actPromise = result.current.sendMessage('Pending query');
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePromise({
        ok: true,
        json: async () => ({ responseText: 'Complete', suggestedAction: 'Action', sources: ['moef.gov.in'] })
      });
      await actPromise;
    });

    expect(result.current.isLoading).toBe(false);
  });
});

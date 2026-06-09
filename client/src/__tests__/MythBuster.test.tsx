import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MythBuster } from '../components/MythBuster';

describe('MythBuster Component', () => {
  const mockOnBustMyth = jest.fn();
  const mockMyths = [
    {
      id: 'm1',
      myth: 'Individual actions make zero impact.',
      truth: 'Aggregated changes scale linearly.'
    }
  ] as const;

  beforeEach(() => {
    mockOnBustMyth.mockClear();
  });

  it('renders common carbon myths safely inside a fieldset', () => {
    render(<MythBuster myths={mockMyths} onBustMyth={mockOnBustMyth} />);
    
    const mythText = screen.getByText(/Myth: Individual actions make zero impact/i);
    expect(mythText).toBeInTheDocument();
    
    const fieldset = screen.getByRole('group');
    expect(fieldset).toBeInTheDocument();
  });

  it('triggers onBustMyth handler when clicking a myth button', () => {
    render(<MythBuster myths={mockMyths} onBustMyth={mockOnBustMyth} />);
    
    const mythButton = screen.getByRole('button');
    fireEvent.click(mythButton);
    
    expect(mockOnBustMyth).toHaveBeenCalledTimes(1);
    expect(mockOnBustMyth).toHaveBeenCalledWith('Individual actions make zero impact.');
  });
});

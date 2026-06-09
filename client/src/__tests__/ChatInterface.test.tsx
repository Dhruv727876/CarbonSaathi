import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatInterface } from '../components/ChatInterface';
import { Message } from '../types';

describe('ChatInterface Component', () => {
  const mockOnSendMessage = jest.fn();
  const mockMessages: Message[] = [
    { id: '1', sender: 'user', text: 'Hello', timestamp: Date.now() },
    { id: '2', sender: 'ai', text: 'Hi, I am CarbonSaathi.', timestamp: Date.now() }
  ];

  beforeEach(() => {
    mockOnSendMessage.mockClear();
  });

  it('renders skip link as the very first focusable node', () => {
    const { container } = render(
      <ChatInterface 
        messages={mockMessages} 
        isLoading={false} 
        error={null} 
        onSendMessage={mockOnSendMessage} 
      />
    );
    
    const skipLink = container.querySelector('a');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveTextContent(/Skip message logs/i);
    expect(skipLink).toHaveAttribute('href', '#chat-input');
  });

  it('allows text input and dispatches onSendMessage callback on submit', () => {
    render(
      <ChatInterface 
        messages={mockMessages} 
        isLoading={false} 
        error={null} 
        onSendMessage={mockOnSendMessage} 
      />
    );
    
    const input = screen.getByLabelText(/Type your carbon tracking message/i);
    fireEvent.change(input, { target: { value: 'How to reduce footprint?' } });
    
    const sendButton = screen.getByLabelText(/Send Message/i);
    fireEvent.click(sendButton);
    
    expect(mockOnSendMessage).toHaveBeenCalledTimes(1);
    expect(mockOnSendMessage).toHaveBeenCalledWith('How to reduce footprint?');
  });

  it('renders messages inside a container with role="log" and proper live regions', () => {
    render(
      <ChatInterface 
        messages={mockMessages} 
        isLoading={false} 
        error={null} 
        onSendMessage={mockOnSendMessage} 
      />
    );
    
    const messageLog = screen.getByRole('log');
    expect(messageLog).toBeInTheDocument();
    expect(messageLog).toHaveAttribute('aria-live', 'polite');
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi, I am CarbonSaathi.')).toBeInTheDocument();
  });
});

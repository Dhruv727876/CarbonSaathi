import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PersonaSelector } from '../components/PersonaSelector';

describe('PersonaSelector Component', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders primary carbon personas as focusable cards', () => {
    render(<PersonaSelector selectedPersona="citizen" onSelect={mockOnSelect} />);
    
    const buttons = screen.getAllByRole('radio');
    expect(buttons).toHaveLength(4);
    
    buttons.forEach((btn: HTMLElement) => {
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveClass('min-h-[44px]');
    });
  });

  it('invokes onSelect handler with correct persona identifier when clicked', () => {
    render(<PersonaSelector selectedPersona="citizen" onSelect={mockOnSelect} />);
    
    const innovatorButton = screen.getByLabelText(/Select Eco-Innovator/i);
    fireEvent.click(innovatorButton);
    
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith('innovator');
  });
});

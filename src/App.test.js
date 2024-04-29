import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<App />);
    const toggleButton = getByTestId('dark-mode-toggle');  // Ensure this id is assigned to the IconButton in your App component
    expect(toggleButton).toBeInTheDocument();
  });
});


import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<App />);
    const toggleButton = getByTestId('dark-mode-toggle');
    expect(toggleButton).toBeInTheDocument();
  });
});


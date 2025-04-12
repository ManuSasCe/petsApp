import { render, screen } from '@testing-library/react';
import HealthBadge from '../components/utils/HealthBadge';
import type { HealthStatus } from '../types';

describe('HealthBadge Component', () => {
  const testCases: HealthStatus[] = ['unhealthy', 'healthy', 'very-healthy'];

  test.each(testCases)('renders correctly with status: %s', (status) => {
    render(<HealthBadge status={status} />);
    
    const badge = screen.getByText(
      status === 'unhealthy' 
        ? 'Unhealthy' 
        : status === 'healthy' 
          ? 'Healthy' 
          : 'Very Healthy'
    );
    
    expect(badge).toBeInTheDocument();
  });

  test('applies correct classes for each status', () => {
    const { rerender } = render(<HealthBadge status="unhealthy" />);
    expect(screen.getByText('Unhealthy')).toHaveClass('bg-red-100 text-red-800 border-red-200');

    rerender(<HealthBadge status="healthy" />);
    expect(screen.getByText('Healthy')).toHaveClass('bg-green-100 text-green-800 border-green-200');

    rerender(<HealthBadge status="very-healthy" />);
    expect(screen.getByText('Very Healthy')).toHaveClass('bg-blue-100 text-blue-800 border-blue-200');
  });

  test('applies default classes for unknown status', () => {
    // @ts-expect-error - Testing invalid status
    render(<HealthBadge status="unknown" />);
    const badge = screen.getByText('Very Healthy'); // Default text
    expect(badge).toHaveClass('bg-gray-100 text-gray-800 border-gray-200');
  });

  test('merges custom className correctly', () => {
    render(<HealthBadge status="healthy" className="custom-class" />);
    const badge = screen.getByText('Healthy');
    expect(badge).toHaveClass('bg-green-100 text-green-800 border-green-200');
    expect(badge).toHaveClass('custom-class');
  });
});
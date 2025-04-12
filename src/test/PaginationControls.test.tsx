import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import PaginationControls from '../components/PaginationControls';

// We need to mock the useTranslation hook so it doesn't fail
jest.mock('react-i18next', () => ({
  // Mock only the useTranslation hook
  useTranslation: () => {
    return {
      t: (str: string) => {
        if (str === 'pagination.showing') return 'Showing';
        if (str === 'pagination.of') return 'of';
        if (str === 'pagination.pets') return 'Pets';
        if (str === 'pagination.previous') return 'Previous';
        if (str === 'pagination.next') return 'Next';
        if (str === 'pagination.last_page') return 'You are on the last page';
        return str;
      },
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));
// --- End of Mock ---

describe('PaginationControls', () => {
  const defaultProps = {
    currentPage: 3,
    totalCount: 55, // for example:  6 pages total if pageSize is 10
    pageSize: 10,
    onPageChange: jest.fn(), 
  };

  // Clear mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('1. should not render if totalCount is 0', () => {
    // Render the component with totalCount 0
    const { container } = render(<PaginationControls {...defaultProps} totalCount={0} />);
    // Verify that the main container is empty (rendered nothing)
    expect(container.firstChild).toBeNull();
  });

  test('2. should render controls if totalCount is greater than 0', () => {
    render(<PaginationControls {...defaultProps} />);
    // Verify that key buttons exist (using text or roles)
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    // Verify that at least one page number is present (for example: the current page)
    expect(screen.getByRole('button', { name: defaultProps.currentPage.toString() })).toBeInTheDocument();
  });

  test('3. should call onPageChange with the correct page number when "Next" is clicked', () => {
    render(<PaginationControls {...defaultProps} />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton); // Simulate the click
    // Verify that onPageChange was called with the next page (currentPage + 1)
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(defaultProps.currentPage + 1);
  });

  test('4. should call onPageChange with the correct page number when "Previous" is clicked', () => {
    render(<PaginationControls {...defaultProps} />);
    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton); // Simulate the click
    // Verify that onPageChange was called with the previous page (currentPage - 1)
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(defaultProps.currentPage - 1);
  });

  test('5. should call onPageChange with the correct page number when a page number is clicked', () => {
    const targetPage = 2;
    render(<PaginationControls {...defaultProps} />);
    const pageButton = screen.getByRole('button', { name: targetPage.toString() });
    fireEvent.click(pageButton); // Simulate the click on page number '2'
    // Verify that onPageChange was called with the clicked page number
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(targetPage);
  });

  test('6. should disable "Previous" button on the first page', () => {
    render(<PaginationControls {...defaultProps} currentPage={1} />);
    const prevButton = screen.getByRole('button', { name: /previous/i });
    // Verify that the button is disabled
    expect(prevButton).toBeDisabled();
  });

  test('7. should disable "Next" button on the last pagee', () => {
    const totalPages = Math.ceil(defaultProps.totalCount / defaultProps.pageSize); // Calculating the last page (6)
    render(<PaginationControls {...defaultProps} currentPage={totalPages} />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    // Verify that the button is disabled
    expect(nextButton).toBeDisabled();
  });

   test('8. should highlight the current page number button', () => {
    render(<PaginationControls {...defaultProps} />);
    const currentPageButton = screen.getByRole('button', { name: defaultProps.currentPage.toString() });
    const otherPageButton = screen.getByRole('button', { name: (defaultProps.currentPage - 1).toString() }); // A different page

    // Verify that the current page button has the "active" classes
    // (Adjust the exact classes if they are different in the actual CSS)
    expect(currentPageButton).toHaveClass('bg-blue-50', 'text-blue-600');
    // Verify that another button does not have these classes
    expect(otherPageButton).not.toHaveClass('bg-blue-50', 'text-blue-600');
    expect(otherPageButton).toHaveClass('bg-white', 'text-gray-500');
   });

});

import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { ScrollToTop } from './components/common/ScrollToTop';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
}

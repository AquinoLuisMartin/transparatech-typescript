import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { ScrollToTop } from './components/common/ScrollToTop';
import { NotificationInitializer } from './context/NotificationContext';

export default function App() {
  return (
    <Router>
      {/* Initialize global notification polling once app is mounted */}
      <NotificationInitializer enabled={true} />
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
}

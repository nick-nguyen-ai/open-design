import { Page } from '../components/Page.js';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <Page title="Page not found" description="That route doesn’t exist in the gallery.">
      <RouterLink to="/" className="text-accent hover:underline">
        Return to the gallery
      </RouterLink>
    </Page>
  );
}

import { lazy, Suspense } from 'react';

// Lazy-load all apps for code-splitting
const ProjectsApp = lazy(() => import('../../apps/Projects/ProjectsApp'));
const AboutApp    = lazy(() => import('../../apps/About/AboutApp'));
const SkillsApp   = lazy(() => import('../../apps/Skills/SkillsApp'));
const ContactApp  = lazy(() => import('../../apps/Contact/ContactApp'));
const TerminalApp = lazy(() => import('../../apps/Terminal/TerminalApp'));
const SettingsApp = lazy(() => import('../../apps/Settings/SettingsApp'));

const APP_MAP = {
  ProjectsApp,
  AboutApp,
  SkillsApp,
  ContactApp,
  TerminalApp,
  SettingsApp,
};

const Spinner = () => (
  <div className="flex items-center justify-center h-full text-gray-400 text-sm gap-2">
    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
    Loading...
  </div>
);

const AppLoader = ({ componentName }) => {
  const AppComponent = APP_MAP[componentName];

  if (!AppComponent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
        <span className="text-3xl">🚧</span>
        <p>Coming soon: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">{componentName}</code></p>
      </div>
    );
  }

  return (
    <Suspense fallback={<Spinner />}>
      <AppComponent />
    </Suspense>
  );
};

export default AppLoader;

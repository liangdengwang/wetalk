import RouterConfig from "./router";
import ThemeProvider from "./components/ThemeProvider";

const App: React.FC = () => (
  <ThemeProvider>
    <RouterConfig />
  </ThemeProvider>
);

export default App;

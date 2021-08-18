import { ApolloProvider } from '@apollo/client';
import { RunRedirect } from '@src/run/runsRedirect';
import { ThemeProvider } from 'bold-ui';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Content, Footer, Header, Layout } from './components';
import { InstanceDetailsView } from './instance/instanceDetailsView';
import { client } from './lib/apolloClient';
import { ProjectEditView } from './project/projectEditView';
import { ProjectsView } from './project/projectsView';
import { RunDetailsView } from './run/runDetails/runDetailsView';
import { RunsView } from './run/runsView';
import { TestDetailsView } from './testItem/testDetailsView';
import { theme } from './theme';

class ErrorBoundary extends React.Component<
  unknown,
  {
    hasError: boolean;
    error: Error | null;
  }
> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1rem' }}>
          {this.state.error && <pre>{this.state.error.stack}</pre>}
          <p>
            Please report at{' '}
            <a
              href="https://github.com/agoldis/sorry-cypress/issues/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github Issues
            </a>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
export const Root = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Router>
          <ErrorBoundary>
            <Layout>
              <Header />
              <Content>
                <Route path="/" exact component={ProjectsView} />

                <Switch>
                  <Route
                    path="/:projectId+/runs/:buildId"
                    component={RunRedirect}
                  />
                  <Route path="/:projectId+/runs" component={RunsView} />
                </Switch>
                <Route path="/:projectId+/edit" component={ProjectEditView} />
                <Route path="/run/:id" component={RunDetailsView} />
                <Route
                  path="/instance/:id"
                  component={InstanceDetailsView}
                  exact
                />
                <Route
                  path="/instance/:instanceId/test/:testId"
                  component={TestDetailsView}
                />
              </Content>
              <Footer />
            </Layout>
          </ErrorBoundary>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
};

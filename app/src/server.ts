import app from '@shared/app-bootstrapper';

app.start(() => {
  console.log(`[App] started on port ${app.appPort}`);
});

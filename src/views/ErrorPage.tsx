import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError(); // 获取错误信息
  console.error(error);

  let errorMessage: string = "";
  if (typeof error === "object" && error !== null) {
    if ("statusText" in error && typeof (error as any).statusText === "string") {
      errorMessage = (error as any).statusText;
    } else if ("message" in error && typeof (error as any).message === "string") {
      errorMessage = (error as any).message;
    }
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage}</i>
      </p>
    </div>
  );
}

export default ErrorPage
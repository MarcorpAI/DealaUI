import React from "react";

// const login = () => {
//   return <div>login</div>;
// };

// export default login;
import "../styles/Form.css";

import Form from "../components/Form";

const login = () => {
  return <Form route="api/token/" method="login" />;
};

export default login;

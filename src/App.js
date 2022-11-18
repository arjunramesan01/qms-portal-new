import "./App.css";
import { Oval } from "react-loader-spinner";
import { useState, useEffect, useRef } from "react";
import Login from "./Components/Login";
import EditorPage from "./Components/EditorPage";
import { useNavigate } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";


function App() {
  const [loginCheckLoader, setLoginCheckLoader] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken") == 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI2MDVhMzc5MTg2M2YzYTViZTE0YjE0NzgiLCJyb2xlIjoiYnlqdS1hbnN3ZXItcmV2aWV3ZXIiLCJ0aW1lc3RhbXAiOiIyMDIxLTA1LTEwVDEwOjM0OjM4LjUyNloiLCJpYXQiOjE2MjA2NDI4Nzh9.f5xoVcgtvWAOwOnbc-VCMDjRwt7P4Pax5ftUL2TRUJQ') {
      setUserInfo({ name: "Root", role: "Admin" });
      setLoginCheckLoader(false);
    } else {
      navigate("/");
      setLoginCheckLoader(false);
    }
  }, [localStorage.getItem("authToken")]);

  return loginCheckLoader ? (
    <div className="loaderContaier">
      <Oval color="#00BFFF" height={50} width={50} />
    </div>
  ) : (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/editor" element={<EditorPage userInfo={userInfo} />} />
        <Route path="/*" element={<Navigate replace to="/" />} />
      </Routes>
    </div>
  );
}

export default App;

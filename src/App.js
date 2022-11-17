import "./App.css";
import { Oval } from "react-loader-spinner";
import { useState, useEffect, useRef } from "react";
import Login from "./Components/Login";
import EditorPage from "./Components/EditorPage";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { devUrl, stgUrl, videoDevUrl } from "./Common";
import { Routes, Route, Navigate } from "react-router-dom";

// async function fetchUserData() {
//   try {
//     const rese = await axios.get(`${videoDevUrl}v1/login/display-role`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//       },
//     });
//     return Promise.resolve(rese.data);
//   } catch (err) {
//     return Promise.reject(err);
//   }
// }

function App() {
  const [loginCheckLoader, setLoginCheckLoader] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      // fetchUserData()
      //   .then((res) => {
      //     setUserInfo(res?.data);
      //     setLoginCheckLoader(false);
      //   })
      //   .catch((err) => {
      //     alert(err);
      //     navigate("/");
      //     setLoginCheckLoader(false);
      //   });
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

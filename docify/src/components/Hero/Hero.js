import React, { useState } from "react";
import "./Hero.css";
import axios from "axios";
import { type } from "@testing-library/user-event/dist/type";
import { useNavigate } from "react-router-dom";
import Repos from "../Repos/Repos";
import { useUser } from "../context/UserContext";

function Hero() {
  const { setUsername, setToken } = useUser();
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [data, setData] = useState({
    username: "",
    token: "",
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setData({ ...data, [name]: value });
  };

  const postData = async (e) => {
    e.preventDefault();
    setUsername(data.username);
    setToken(data.token);
    navigate("repos");
  };

  return (
    <div className="hero_sec">
      <div className="content_sec">
        <div className="content_head">
          <h1 className="head1 text-6xl text-violet-500 font-bold my-3">
            AI Documentation Platform
          </h1>
          <h1 className="head2 text-5xl text-violet-50 font-bold my-3">
            for Github Repos
          </h1>
          <p className="text-violet-50 my-10">
            Docify Automates the process of Generating documentation for your
            github Repos effortlessly leveraging AI capabalities.
          </p>
        </div>
        <div className="content_btn">
          <div className="input_text_boxes">
            <div className="user_name">
              <label className="username_label">Username : </label>
              <input
                name="username"
                type="text"
                className="input_username"
                placeholder="Username"
                onChange={handleInputs}
              ></input>
            </div>
            <div className="tok_en">
              <label className="token_label">Token : </label>
              <input
                name="token"
                type="text"
                className="input_acs_token"
                placeholder="Acces Token"
                onChange={handleInputs}
              ></input>
            </div>
            <div className="btn_get_started_div">
              <button className="btn" onClick={postData}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;

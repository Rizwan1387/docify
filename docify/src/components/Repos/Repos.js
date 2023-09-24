import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axios from "axios";
import "./Repos.css";
import Spinner from "../Spinner/Spinner";

function Repos() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { username, token, setPath, setRepo, repo, path } = useUser();
  const [listData, setListData] = useState([]);
  setPath("");

  const getData = async () => {
    const responce = await axios.post(`https://docifyapi.onrender.com/repos`, {
      username,
      token,
    });

    if (responce) {
      setListData(responce.data.result);
      setIsLoading(false);
    } else {
      alert("Error");
    }
  };

  const getDescr = () => {
    navigate("descr");
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="cart_outer_div">
        <div className="cart_heading">
          <h1 className="text-4xl text-slate-400 font-bold my-8 ">
            Select a Repository to Generate AI Documentation
          </h1>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="cart_inner_div grid grid-cols-4 gap-4">
            {listData.map((data) => (
              <div className="card my-4 mx-4">
                <h1
                  className="data text-xl text-slate-100"
                  name="reponame"
                  type="text"
                  onClick={() => {
                    setRepo({ data }, getDescr());
                  }}
                >
                  {data}
                </h1>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Repos;

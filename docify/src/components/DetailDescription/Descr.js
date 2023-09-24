import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import Spinner from "../Spinner/Spinner";
import "../Repos/Repos.css";
import "./Desc.css";

function Descr() {
  const { username, token, repo, path } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [description, setDescription] = useState([]);
  console.log(description);

  const getDescr = async () => {
    await axios
      .post(`https://docifyapi.onrender.com/aidocs`, {
        username,
        token,
        path: "",
        repo: repo.data,
      })
      .then((responce) => {
        setDescription(responce.data);
        setIsLoading(false); // Set isLoading to false when data is received
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set isLoading to false in case of an error
      });
  };

  useEffect(() => {
    getDescr();
  }, []);
  return (
    <div>
      <div className="desc_outer_div">
        <div className="desc_heading">
          <h1 className="text-4xl text-slate-400 font-bold my-8 ">
            Welcome to your AI Documentation
          </h1>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="desc_inner_div">
            <div className="desc">
              <table class="table-auto">
                <thead>
                  <tr>
                    <th className="text-white mx-5">Path</th>
                    <th className="text-white mx-5">Documentation</th>
                  </tr>
                </thead>

                {description.map((data) => (
                  <tbody className="my-5">
                    <hr className="text-white my-5" />
                    <tr>
                      <td className="path text-white">
                        <pre>{data.path}</pre>
                      </td>
                      <td className="doc text-white">
                        <pre>{data.documentation}</pre>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Descr;

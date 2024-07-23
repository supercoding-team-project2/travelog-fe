import React, { useState, useEffect } from "react";
import axios from "axios";

import classNames from "classnames/bind";
import styles from "./MyInfo.module.css";

import Image from "next/image";
import { StaticImageData } from "next/image";

const cx = classNames.bind(styles);

interface Props {
  profilePic: string | StaticImageData;
  setProfilePic: React.Dispatch<React.SetStateAction<string | StaticImageData>>;
}

const MyInfo = ({ profilePic, setProfilePic }: Props) => {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    residentNum: "",
    gender: "",
  });
  const [firstResidentNum, setFirstResidentNum] = useState("");
  const [secondMaskedNum, setSecondMaskedNum] = useState("");

  //axios get when rendered
  useEffect(() => {
    // const accessToken = localStorage.getItem("accessToken");
    // if (accessToken) {
    //   axios
    //     .get("/api/user", {
    //       headers: { Authorization: `Bearer ${accessToken}` },
    //     })
    //     .then((response) => {
    //       const userData = response.data;
    //       console.log("회원 정보 조회 데이터", userData);
    //       setUserData({
    //         email: userData.email,
    //         name: userData.name,
    //         residentNum: userData.residentNum,
    //         gender: userData.gender,
    //       });
    //       setProfilePic(userData.profilePictureUrl);
    //     })
    //     .catch((error) => {
    //       console.error("회원 정보 조회 요청 실패", error);
    //     });
    // }
  }, []);

  //when userData.residentNum exists, set the resident number states
  useEffect(() => {
    if (userData.residentNum.length > 0) {
      splitResidentNumber(userData.residentNum);
    }
  }, [userData.residentNum]);

  const splitResidentNumber = (residentNum: string) => {
    const firstNumber = residentNum.slice(0, -1);
    setFirstResidentNum(firstNumber);

    const secondNumber = residentNum[residentNum.length - 1];
    const maskedSecondNumber = secondNumber + "*".repeat(6);
    setSecondMaskedNum(maskedSecondNumber);
  };

  const sortGender = () => {
    if (userData.gender === "MALE") {
      return "남성";
    } else {
      return "여성";
    }
  };

  //프로필 수정 axios put 요청 로직 
  const pictureChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append("profilePictureUrl", file);

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      axios
        .put("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setProfilePic(response.data.profilePictureUrl);
          console.log("프로필 사진 수정 성공");
        })
        .catch((error) => {
          console.error("프로필 사진 수정 실패", error);
        });
    }
  };
  return (
    <div className={cx("myinfo-container")}>
      <div className={cx("myinfo-statement")}>회원 정보</div>
      <div className={cx("myinfo-div")}>
        <div className={cx("myinfo-details")}>
          <div className={cx("email-container")}>
            <label className={cx("email-label")}>Email:</label>
            <div className={cx("email")}>{userData.email}</div>
          </div>
          <div className={cx("name-container")}>
            <label className={cx("name-label")}>Name:</label>
            <div className={cx("name")}>{userData.name}</div>
          </div>
          <div className={cx("socialNum-container")}>
            <label className={cx("socialNum-label")}>주민등록번호:</label>
            <div className={cx("socialNum-container")}>
              <div>
                {firstResidentNum}-{secondMaskedNum}
              </div>
            </div>
          </div>
          <div className={cx("gender-container")}>
            <input className={cx("gender-input")} type="radio" checked />
            <label className={cx("gender-label")}>{sortGender()}</label>
          </div>
        </div>
        <div className={cx("picture-container")}>
          <div className={cx("image-container")}>
            <Image
              src={profilePic}
              alt="user-image"
              className={cx("user-image")}
              width={120}
              height={120}
            />
          </div>
          <div className={cx("modify-container")}>
            <button className={cx("modify-button")}>
              <label
                htmlFor="image-change-input"
                className={cx("modify-label")}
              >
                프로필 사진 수정
              </label>
              <input
                id="image-change-input"
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                onChange={pictureChangeHandler}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfo;

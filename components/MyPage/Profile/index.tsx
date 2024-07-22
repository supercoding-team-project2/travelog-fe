import React from "react";

import classNames from "classnames/bind";
import styles from "./Profile.module.css";
import Image from "next/image";
import { StaticImageData } from "next/image";
import downArrow from "../../../assets/down-arrow.png";

const cx = classNames.bind(styles);

interface Props {
  isMyCourseOpen: boolean;
  isMyPostOpen: boolean;
  isMyInfoOpen: boolean;
  profilePic: string | StaticImageData;
  setIsMyCourseOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMyPostOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMyInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Profile: React.FC<Props> = ({
  isMyCourseOpen,
  isMyPostOpen,
  isMyInfoOpen,
  profilePic,
  setIsMyCourseOpen,
  setIsMyPostOpen,
  setIsMyInfoOpen,
}) => {
  // 네브 중 하나 눌렀을 때 true 변환 로직
  const clickNavHandler = (nav: string) => {
    setIsMyCourseOpen(nav === "course");
    setIsMyPostOpen(nav === "post");
    setIsMyInfoOpen(nav === "info");
    window.scrollTo({top: 0})
  };

  return (
    <div className={cx("profile-container")}>
      <div className={cx("name-photo-container")}>
        <Image
          src={profilePic}
          alt="user photo"
          className={cx("user-photo")}
          width={90}
          height={90}
        />
        <div className={cx("name")}>유저 네임</div>
      </div>
      <div className={cx("navigation-container")}>
        <div className={cx("each-navigation")}>
          <div
            className={cx("each-navigation-container")}
            onClick={() => clickNavHandler("course")}
          >
            <Image
              src={downArrow}
              alt="down arrow"
              className={cx("down-arrow", {
                "down-arrow-active": isMyCourseOpen,
              })}
            />
            내 경로 목록
          </div>
          <div
            className={cx("underline", { "underline-active": isMyCourseOpen })}
          ></div>
        </div>
        <div className={cx("each-navigation")}>
          <div
            className={cx("each-navigation-container")}
            onClick={() => clickNavHandler("post")}
          >
            <Image
              src={downArrow}
              alt="down arrow"
              className={cx("down-arrow", {
                "down-arrow-active": isMyPostOpen,
              })}
            />
            내가 작성한 게시글
          </div>
          <div
            className={cx("underline", { "underline-active": isMyPostOpen })}
          ></div>
        </div>
        <div className={cx("each-navigation")}>
          <div
            className={cx("each-navigation-container")}
            onClick={() => clickNavHandler("info")}
          >
            <Image
              src={downArrow}
              alt="down arrow"
              className={cx("down-arrow", {
                "down-arrow-active": isMyInfoOpen,
              })}
            />
            내 정보
          </div>
          <div
            className={cx("underline", { "underline-active": isMyInfoOpen })}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

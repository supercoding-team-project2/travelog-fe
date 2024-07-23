import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { DateRangePickerProps } from "react-date-range";
import EachDate from "./EachDate";
import classnames from "classnames/bind";
import styles from "./DateCourse.module.css";

const cx = classnames.bind(styles);

interface Props {
  title: string;
  dateRange: DateRangePickerProps["ranges"];
  dateData: { [date: string]: any[] };
  setDateData: React.Dispatch<React.SetStateAction<{ [date: string]: any[] }>>;
  setIsDateConfirmed: React.Dispatch<React.SetStateAction<{}>>;
  setIsSaved: React.Dispatch<
    React.SetStateAction<{ [placeId: string]: boolean }>
  >;
}

const DateCourse = ({
  title,
  dateRange,
  dateData,
  setDateData,
  setIsDateConfirmed,
  setIsSaved,
}: Props) => {
  const [dates, setDates] = useState<Date[]>([]);
  const [description, setDescription] = useState("");

  //get all the dates from startDate to endDate
  const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
    const dates: any = [];

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  //get dates between startDate and endDate at the first render
  useEffect(() => {
    if (dateRange && dateRange.length > 0) {
      const startDate = dateRange[0]?.startDate;
      const endDate = dateRange[0]?.endDate;

      if (startDate && endDate) {
        const getDates = getDatesBetween(startDate, endDate);
        setDates(getDates);
      }
    }
  }, [dateRange]);

  const descriptionChangeHandler = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const textareaValue = event.target.value;

    if (textareaValue.trim().length > 0) {
      setDescription(textareaValue);
    } 
  };

  const transformCategory = (category: string) => {
    if(category === "숙소") {
      return "ACCOMMODATION"
    }
    if(category === "카페") {
      return "CAFE"
    }
    if(category === "음식점") {
      return "RESTAURANT"
    }
    if(category === "명소") {
      return "ATTRACTION"
    }
    return "ETC";
  }

  const handleCourseSave = () => {
    if (dateRange && dateRange.length > 0) {
      const startDate = dateRange[0]?.startDate;
      const endDate = dateRange[0]?.endDate;
   
      const transformedDateData = {
        title: title,
        description: description,
        startAt: startDate?.toISOString().split("T")[0],
        endAt: endDate?.toISOString().split("T")[0],
        createdAt: new Date(),
        days: Object.keys(dateData).map((date) => ({
          day: date,
          places: dateData[date].map((place) => ({
            placeName: place.name,
            placeCategory: transformCategory(place.category),
          })),
        })),
      };

      //axios post 요청
      // const accessToken = localStorage.getItem("accessToken");
      // axios.post(
      //   "/api/routes/add",
      //   {
      //     transformedDateData,
      //   },
      //   { headers: { Authorization: `Bearer ${accessToken}` } }
      // );
    }
  };

  return (
    <div className={cx("date-course-container")}>
      {dates.length > 0 &&
        dates.map((date: Date, index: number) => {
          return (
            <EachDate
              key={index}
              date={date}
              dateData={dateData}
              setDateData={setDateData}
              setIsDateConfirmed={setIsDateConfirmed}
              setIsSaved={setIsSaved}
            />
          );
        })}
      <div className={cx("memo-button-container")}>
        <textarea
          className={cx("memo-container")}
          placeholder="이 여행 경로에 대한 메모 작성하기"
          value={description}
          onChange={descriptionChangeHandler}
        ></textarea>
        <div className={cx("button-container")}>
          <button className={cx("cancel-button")}>취소</button>
          <button className={cx("save-button")} onClick={handleCourseSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateCourse;

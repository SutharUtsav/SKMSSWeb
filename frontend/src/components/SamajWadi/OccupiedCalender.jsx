import React, { useEffect } from 'react'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css'
import { useState } from 'react';
import { getByQueryParams } from '../../service/api-service';
import useApiCall from '../../hooks/useApiCall';

const OccupiedCalender = (props) => {


  // const [date, setdate] = useState(new Date())

  const date = new Date();
  const jsonForm = {
    month: date.getMonth() + 1,
    year: date.getFullYear()
  }
  let { data, setData, error, setError, loading, setLoading } = useApiCall(() =>
    getByQueryParams("/samajwadi-occupied/look-up", jsonForm)
  );

  const handleDateChange = (e) => {
    if (props.enableSelection && props.setDates) {
      const fromDate = new Date(e[0]);
      const toDate = new Date(e[1]);

      props.setDates(fromDate, toDate);
    }
  }

  const handleClickMonth = (e) => {
    const fromDate = new Date(e.activeStartDate)

    props.setDates(fromDate, fromDate);

    const jsonForm = {
      month: fromDate.getMonth() + 1,
      year: fromDate.getFullYear()
    }
    getByQueryParams("/samajwadi-occupied/look-up", jsonForm)
      .then((response) => {
        // console.log(response);
        if (response.data.status === 1) {
          setData(response.data);
        } else {
          setError(response.data.error);
        }
      })
      .catch((err) => {
        error = err;
      })
  }

  const handleOnActiveStartDateChange = (e) => {
    const fromDate = new Date(e.activeStartDate);
    props.setDates(fromDate, fromDate);
    const jsonForm = {
      month: fromDate.getMonth() + 1,
      year: fromDate.getFullYear()
    }
    getByQueryParams("/samajwadi-occupied/look-up", jsonForm)
      .then((response) => {
        // console.log(response);
        if (response.data.status === 1) {
          setData(response.data);
        } else {
          setError(response.data.error);
        }
      })
      .catch((err) => {
        error = err;
      })
  }

  return (
    <div style={{ width: "70vw" }}>
      {data && data.status === 1 ?
        (
          <Calendar defaultValue={new Date()} showNavigation={true} selectRange={true}
            onChange={handleDateChange}
            onClickMonth={handleClickMonth}
            onActiveStartDateChange={handleOnActiveStartDateChange}
            tileClassName={({ date }) => {
              return data.data.find(event => new Date(event.fromDate).setHours(0, 0, 0, 0) <= date && new Date(event.toDate).setHours(0, 0, 0, 0) >= date) ? 'highlight-date' : ""
            }}
            tileContent={({ date }) => {
              const event = data.data.find(event => new Date(event.fromDate).setHours(0, 0, 0, 0) <= date && new Date(event.toDate).setHours(0, 0, 0, 0) >= date);
              return event ? <div className='highlight-event px-1 py-2'>
                <p>{event.eventTitle}</p>
                <div className='highlight-event-card card'>
                  <p className='px-1'>{event.eventTitle}</p>
                  <p className='px-1'>{event.eventDescription}</p>
                </div>
              </div> : ""
            }}
          />
        ) :

        (
          <>
            <p className='text-danger fs-3'>{error?.errorMsg}</p>
            <Calendar defaultValue={new Date()} showNavigation={true} selectRange={true}
            onChange={handleDateChange}
            onClickMonth={handleClickMonth}
            onActiveStartDateChange={handleOnActiveStartDateChange}/>
          </>)}
    </div>
  )
}

export default OccupiedCalender

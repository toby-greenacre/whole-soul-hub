document.addEventListener("DOMContentLoaded", () => { //once the page is loaded
  const calendarContainer = document.getElementById("calendar"); //get the calander container
  const today = new Date(); //get todays date

  const formatDate = (date) => date.toISOString().split("T")[0]; //function that formats dates so it matches json

  const generateCalendar = async () => { //main function
      const eventData = await fetch("data/events.json") //fetch json file
          .then((res) => res.json()) //read the json
          .then((data) => data.events) //get the events array from the json
          .catch((err) => {
              console.error("Failed to load events.json:", err); //catch any errors and create calandar with empty list
              return [];
          });

      for (let week = 0; week < 2; week++) { //one loop for each week
          const weekRow = document.createElement("div"); //create week div element with calander-week class
          weekRow.classList.add("calendar-week");

          for (let day = 0; day < 7; day++) { //for each day of the week
              const index = week * 7 + day; //get the current position from 0-13 in the 2 week grid
              const currentDate = new Date(today);
              currentDate.setDate(today.getDate() + index); //day that its creating is the current day + that 0-13 value
              const dateString = formatDate(currentDate); //format the date with the function

              const eventsForTheDay = eventData.filter((e) => e.date === dateString); //find all events that match that date

              const dayEl = document.createElement("div"); //create new div element with calander-day class
              dayEl.classList.add("calendar-day");

              const dateHeader = document.createElement("h3"); //create heading 
              const options = { weekday: 'short', month: 'short', day: 'numeric' }; //custom date format 'eg: Mon, 25 Jul'
              dateHeader.textContent = currentDate.toLocaleDateString('en-GB', options); //make the heading the current date for that box
              dayEl.appendChild(dateHeader); //add the heading to the calander day 

              if (eventsForTheDay.length > 0) { //if there are events on this day
                  eventsForTheDay.forEach((event) => {
                      const title = document.createElement("div"); //create new div element called event-title
                      title.classList.add("event-title");
                      title.textContent = event.title; //get the event title
                      dayEl.appendChild(title); //add the title to the calander day

                      const time = document.createElement("p"); //create new p element for the time
                      time.textContent = event.time; //get the time of the class
                      dayEl.appendChild(time); //add the time to the calander day

                      if (event.image) { //if theres an image
                          const img = document.createElement("img"); //create an image element
                          img.src = `images/events/${event.image}`; //sets the image source based on file name in the event object
                          img.alt = event.title; //alt text is just event title
                          dayEl.appendChild(img); //add image to the calander day
                      }
                  });
              } else { //if no event on that day
                  const noEvent = document.createElement("p"); //create p element
                  noEvent.textContent = "No events"; //make the p say no events
                  dayEl.appendChild(noEvent); //add p to the calander day
              }

              weekRow.appendChild(dayEl); //add that day to the week
          }

          calendarContainer.appendChild(weekRow); //add that week to the calander
      }
  };

  generateCalendar(); //call main function
});

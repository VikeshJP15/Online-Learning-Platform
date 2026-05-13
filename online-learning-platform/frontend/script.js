fetch("http://localhost:8080/courses")
  .then(res => res.json())
  .then(data => {
      const courseList = document.getElementById("course-list");
      courseList.innerHTML = "";

      data.forEach(course => {
          courseList.innerHTML += `
              <div class="course-card">
                  <h3>${course.title}</h3>
                  <p>${course.description}</p>
                  <button onclick="enroll('${course.title}')">Enroll</button>
              </div>
          `;
      });
  });

function enroll(title) {
    let myCourses = JSON.parse(localStorage.getItem("myCourses")) || [];
    myCourses.push(title);
    localStorage.setItem("myCourses", JSON.stringify(myCourses));
    alert("Enrolled in " + title);
}
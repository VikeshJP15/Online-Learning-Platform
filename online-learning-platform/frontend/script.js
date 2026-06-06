const fallbackCourses = [
    {
        id: 1,
        title: "Java Foundations",
        description: "Start with variables, control flow, methods, classes, and object-oriented thinking.",
        level: "Beginner",
        duration: "5 hours",
        skills: ["Syntax", "OOP", "Practice"],
        youtubeUrl: "https://www.youtube.com/results?search_query=java+programming+full+course+for+beginners",
        lessons: ["Java setup and first program", "Variables and data types", "Conditions and loops", "Methods and classes"]
    },
    {
        id: 2,
        title: "Object-Oriented Java",
        description: "Master inheritance, abstraction, interfaces, packages, and clean class design.",
        level: "Beginner+",
        duration: "4 hours",
        skills: ["Classes", "Interfaces", "Design"],
        youtubeUrl: "https://www.youtube.com/results?search_query=java+oop+concepts+full+course",
        lessons: ["Encapsulation", "Inheritance", "Interfaces", "Polymorphism"]
    },
    {
        id: 3,
        title: "Java Collections and Streams",
        description: "Use lists, maps, sets, generics, lambdas, and streams for practical data handling.",
        level: "Intermediate",
        duration: "6 hours",
        skills: ["Collections", "Streams", "Generics"],
        youtubeUrl: "https://www.youtube.com/results?search_query=java+collections+framework+and+streams+tutorial",
        lessons: ["Lists and sets", "Maps and queues", "Generics", "Streams and lambdas"]
    },
    {
        id: 4,
        title: "Spring Boot REST APIs",
        description: "Build backend APIs with controllers, services, repositories, validation, and MySQL.",
        level: "Intermediate",
        duration: "7 hours",
        skills: ["Spring Boot", "REST", "MySQL"],
        youtubeUrl: "https://www.youtube.com/results?search_query=spring+boot+rest+api+full+course+mysql",
        lessons: ["Spring Boot project setup", "Controllers and services", "JPA repositories", "CRUD API with MySQL"]
    },
    {
        id: 5,
        title: "Java DSA for Interviews",
        description: "Practice arrays, strings, recursion, linked lists, stacks, queues, trees, and sorting.",
        level: "Interview",
        duration: "8 hours",
        skills: ["DSA", "Problem solving", "Interviews"],
        youtubeUrl: "https://www.youtube.com/results?search_query=java+dsa+full+course+interview+preparation",
        lessons: ["Arrays and strings", "Recursion", "Stacks and queues", "Trees and sorting"]
    },
    {
        id: 6,
        title: "Java Project Lab",
        description: "Apply your skills by building mini projects, REST services, and portfolio-ready apps.",
        level: "Project",
        duration: "5 hours",
        skills: ["Projects", "Git", "Deployment"],
        youtubeUrl: "https://www.youtube.com/results?search_query=java+projects+for+beginners+with+source+code",
        lessons: ["Console app project", "JDBC project", "Spring Boot project", "Portfolio polish"]
    }
];

let courses = [...fallbackCourses];
let selectedCourse = null;

document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page || "home";

    if (page === "mycourses") {
        renderMyCourses();
        return;
    }

    if (page === "course") {
        const id = Number(new URLSearchParams(window.location.search).get("id") || localStorage.getItem("selectedCourse"));
        selectedCourse = findCourse(id) || courses[0];
        renderCourseDetails(selectedCourse);
        return;
    }

    renderCourseCards(courses);
    bindSearch();
    updateHeroStats();
    loadBackendCourses();
});

function loadBackendCourses() {
    fetch("http://localhost:8080/courses")
        .then((res) => {
            if (!res.ok) {
                throw new Error("Backend unavailable");
            }
            return res.json();
        })
        .then((backendCourses) => {
            if (!Array.isArray(backendCourses) || backendCourses.length === 0) {
                return;
            }

            courses = backendCourses.map((course, index) => ({
                ...fallbackCourses[index % fallbackCourses.length],
                ...course,
                id: Number(course.id || index + 1)
            }));
            renderCourseCards(courses);
            updateHeroStats();
        })
        .catch(() => {
            renderCourseCards(courses);
        });
}

function bindSearch() {
    const search = document.getElementById("search");
    if (!search) {
        return;
    }

    search.addEventListener("input", (event) => {
        const value = event.target.value.trim().toLowerCase();
        const filtered = courses.filter((course) => {
            const text = `${course.title} ${course.description} ${(course.skills || []).join(" ")}`.toLowerCase();
            return text.includes(value);
        });
        renderCourseCards(filtered);
    });
}

function renderCourseCards(list) {
    const courseList = document.getElementById("course-list");
    if (!courseList) {
        return;
    }

    if (!list.length) {
        courseList.innerHTML = `
            <div class="empty-state">
                <h3>No courses found</h3>
                <p>Try searching for Java, Spring Boot, DSA, or projects.</p>
            </div>
        `;
        return;
    }

    courseList.innerHTML = list.map((course) => {
        const progress = getCourseProgress(course.id);
        return `
            <article class="course-card">
                <div class="card-topline">
                    <span class="level-pill">${course.level || "Java"}</span>
                    <span class="duration">${course.duration || "Self paced"}</span>
                </div>
                <div>
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                </div>
                <div class="card-meta">
                    ${(course.skills || ["Java"]).map((skill) => `<span>${skill}</span>`).join("")}
                    <span>${progress}% done</span>
                </div>
                <div class="card-actions">
                    <button class="button ghost" type="button" onclick="viewCourse(${course.id})">View</button>
                    <a class="button youtube" href="${course.youtubeUrl}" target="_blank" rel="noopener">YouTube</a>
                </div>
            </article>
        `;
    }).join("");
}

function viewCourse(id) {
    selectedCourse = findCourse(id);
    if (!selectedCourse) {
        return;
    }

    localStorage.setItem("selectedCourse", String(id));

    const courseList = document.getElementById("course-list");
    const details = document.getElementById("course-details");
    if (courseList && details) {
        courseList.hidden = true;
        details.hidden = false;
        renderCourseDetails(selectedCourse);
        details.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
    }

    window.location.href = `course.html?id=${id}`;
}

function renderCourseDetails(course) {
    const details = document.getElementById("course-details");
    const info = document.getElementById("course-info");
    const lessonList = document.getElementById("lessonList");
    const youtubeLink = document.getElementById("youtubeLink");
    if (!details || !info || !lessonList || !youtubeLink) {
        return;
    }

    info.innerHTML = `
        <p class="eyebrow">${course.level || "Java course"} / ${course.duration || "Self paced"}</p>
        <h2>${course.title}</h2>
        <p>${course.description}</p>
    `;

    youtubeLink.href = course.youtubeUrl;
    lessonList.innerHTML = (course.lessons || fallbackCourses[0].lessons).map((lesson, index) => `
        <div class="lesson-item">
            <label>
                <input type="checkbox" data-lesson-index="${index}" onchange="updateProgress()">
                <span>${lesson}</span>
            </label>
        </div>
    `).join("");

    restoreLessonState(course.id);
    updateProgress(false);
}

function enrollCourse() {
    if (!selectedCourse) {
        return;
    }

    const enrolled = getEnrolledCourses();
    const exists = enrolled.some((course) => Number(course.id) === Number(selectedCourse.id));
    if (!exists) {
        enrolled.push(selectedCourse);
        localStorage.setItem("myCourses", JSON.stringify(enrolled));
    }

    updateHeroStats();
    alert("Course enrolled successfully. Open My Courses to continue anytime.");
}

function updateProgress(shouldSave = true) {
    if (!selectedCourse) {
        return;
    }

    const checkboxes = [...document.querySelectorAll("#course-details input[type='checkbox']")];
    const total = checkboxes.length || 1;
    const checked = checkboxes.filter((checkbox) => checkbox.checked).length;
    const percent = Math.round((checked / total) * 100);

    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    if (progressBar) {
        progressBar.value = percent;
    }
    if (progressText) {
        progressText.innerText = `${percent}% completed`;
    }

    if (shouldSave) {
        const lessonState = checkboxes.map((checkbox) => checkbox.checked);
        const progressData = JSON.parse(localStorage.getItem("progress")) || {};
        progressData[selectedCourse.id] = { percent, lessonState };
        localStorage.setItem("progress", JSON.stringify(progressData));
        updateHeroStats();
    }
}

function restoreLessonState(id) {
    const progressData = JSON.parse(localStorage.getItem("progress")) || {};
    const saved = progressData[id];
    if (!saved || !Array.isArray(saved.lessonState)) {
        return;
    }

    document.querySelectorAll("#course-details input[type='checkbox']").forEach((checkbox, index) => {
        checkbox.checked = Boolean(saved.lessonState[index]);
    });
}

function backToCourses() {
    const details = document.getElementById("course-details");
    const courseList = document.getElementById("course-list");
    if (details) {
        details.hidden = true;
    }
    if (courseList) {
        courseList.hidden = false;
    }
}

function renderMyCourses() {
    const container = document.getElementById("myCourseList");
    if (!container) {
        return;
    }

    const enrolled = getEnrolledCourses();
    if (!enrolled.length) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No enrolled courses yet</h3>
                <p>Explore the catalog and enroll in a Java course to start your learning dashboard.</p>
                <a class="button primary" href="index.html#courses">Browse courses</a>
            </div>
        `;
        return;
    }

    container.innerHTML = enrolled.map((course) => {
        const fullCourse = findCourse(course.id) || course;
        const progress = getCourseProgress(fullCourse.id);
        return `
            <article class="course-card">
                <div class="card-topline">
                    <span class="level-pill">${fullCourse.level || "Java"}</span>
                    <span class="duration">${fullCourse.duration || "Self paced"}</span>
                </div>
                <div>
                    <h3>${fullCourse.title}</h3>
                    <p>${fullCourse.description}</p>
                </div>
                <div class="card-meta">
                    <span>${progress}% completed</span>
                    ${(fullCourse.skills || ["Java"]).slice(0, 2).map((skill) => `<span>${skill}</span>`).join("")}
                </div>
                <div class="card-actions">
                    <a class="button ghost" href="course.html?id=${fullCourse.id}">Continue</a>
                    <a class="button youtube" href="${fullCourse.youtubeUrl}" target="_blank" rel="noopener">YouTube</a>
                </div>
            </article>
        `;
    }).join("");
}

function findCourse(id) {
    return courses.find((course) => Number(course.id) === Number(id)) || fallbackCourses.find((course) => Number(course.id) === Number(id));
}

function getEnrolledCourses() {
    return JSON.parse(localStorage.getItem("myCourses")) || [];
}

function getCourseProgress(id) {
    const progressData = JSON.parse(localStorage.getItem("progress")) || {};
    const saved = progressData[id];
    if (typeof saved === "number") {
        return saved;
    }
    return saved?.percent || 0;
}

function updateHeroStats() {
    const activeTracks = document.getElementById("activeTracks");
    const savedProgress = document.getElementById("savedProgress");
    const enrolledCount = document.getElementById("enrolledCount");
    if (!activeTracks || !savedProgress || !enrolledCount) {
        return;
    }

    const enrolled = getEnrolledCourses();
    const progressValues = courses.map((course) => getCourseProgress(course.id));
    const average = progressValues.length
        ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length)
        : 0;

    activeTracks.innerText = String(courses.length);
    savedProgress.innerText = `${average}%`;
    enrolledCount.innerText = String(enrolled.length);
}

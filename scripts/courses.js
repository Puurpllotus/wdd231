const coursesData = [
  { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2 },
  { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2 },
  { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2 },
  { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2 },
  { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2 },
  { subject: 'WDD', number: 231, title: 'Frontend Web Development I', credits: 2 }
];

const allBtn = document.getElementById('allBtn');
const wddBtn = document.getElementById('wddBtn');
const cseBtn = document.getElementById('cseBtn');
const courseList = document.getElementById('courseList');
const totalCourses = document.getElementById('totalCourses');
const totalCredits = document.getElementById('totalCredits'); // 👈 Add this in your HTML below totalCourses

function renderCourses() {
  courseList.innerHTML = ''; 
  coursesData.forEach(course => {
    const btn = document.createElement('button');
    btn.textContent = `${course.subject} ${course.number}`;
    btn.classList.add('course-btn');
    btn.dataset.subject = course.subject;
    btn.dataset.number = course.number;
    btn.dataset.credits = course.credits;
    courseList.appendChild(btn);
  });
}

function updateTotals(subject = 'ALL') {
  const allButtons = document.querySelectorAll('.course-btn');
  const visibleCourses = Array.from(allButtons).filter(course =>
    subject === 'ALL' || course.dataset.subject === subject
  );

  const visibleCount = visibleCourses.filter(c => c.style.display !== 'none').length;
  totalCourses.textContent = `The total number of courses listed below is ${visibleCount}`;


  const totalCreditsValue = visibleCourses.reduce((sum, course) => {
    if (!course.classList.contains('completed')) {
      return sum + Number(course.dataset.credits);
    }
    return sum;
  }, 0);

  totalCredits.textContent = `The total number of credits is ${totalCreditsValue}`;
}

function filterCourses(subject) {
  const courses = document.querySelectorAll('.course-btn');

  courses.forEach(course => {
    const matches = subject === 'ALL' || course.dataset.subject === subject;
    course.style.display = matches ? 'block' : 'none';
  });

  updateTotals(subject);
}

courseList.addEventListener('click', e => {
  if (e.target.classList.contains('course-btn')) {
    e.target.classList.toggle('completed');
    updateTotals(); 
  }
});

allBtn.addEventListener('click', () => filterCourses('ALL'));
wddBtn.addEventListener('click', () => filterCourses('WDD'));
cseBtn.addEventListener('click', () => filterCourses('CSE'));

renderCourses();
filterCourses('ALL');

const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});




// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})



const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})


if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})


// Dark Mode
const switchMode = document.getElementById('switch-mode');

// Check stored preference on page load
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark');
    switchMode.checked = true;
}

switchMode.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('dark-mode', 'true');
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('dark-mode', 'false');
    }
});

//Appointment Date ----------------------------------------------------------------
function updateDate() {
	const dateElement = document.getElementById('current-date');
	const now = new Date();
	const options = { year: 'numeric', month: 'long', day: 'numeric' };
	dateElement.textContent = now.toLocaleDateString(undefined, options);
}
window.onload = updateDate;

//Chart Date ----------------------------------------------------------------
function updateChartDate() {
	const dateElement = document.getElementById('current-chart');
	const now = new Date();
	const options = { year: 'numeric', month: 'long' };
	dateElement.textContent = now.toLocaleDateString(undefined, options);
}
window.onload = updateChartDate;


//Visitor Date ----------------------------------------------------------------
function updateVisitorDate() {
	const dateElement = document.getElementById('current-visitor');
	const now = new Date();
	const options = { year: 'numeric', month: 'long', day: 'numeric' };
	dateElement.textContent = now.toLocaleDateString(undefined, options);
}
window.onload = updateVisitorDate;


//Inquire Date ----------------------------------------------------------------
function updateInquireDate() {
	const dateElement = document.getElementById('current-inquire');
	const now = new Date();
	const options = { year: 'numeric', month: 'long', day: 'numeric' };
	dateElement.textContent = now.toLocaleDateString(undefined, options);
}
window.onload = updateInquireDate;

function updateDates() {
    updateDate();
    updateChartDate();
    updateVisitorDate();
    updateInquireDate();
}

window.onload = updateDates;


//Profile ------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function() {
    let ProfileImg = document.getElementById("profile-img");
    let NavbarProfileImg = document.getElementById("navbar-profile-img");
    let insertFile = document.getElementById("insert-file");


    function updateProfileImages(imageSrc) {
        if (ProfileImg) {
            ProfileImg.src = imageSrc;
        }
        if (NavbarProfileImg) {
            NavbarProfileImg.src = imageSrc;
        }

        localStorage.setItem('profileImage', imageSrc);
    }

    if (localStorage.getItem('profileImage')) {
        let savedImageSrc = localStorage.getItem('profileImage');
        updateProfileImages(savedImageSrc);
    }

    if (insertFile) {
        insertFile.onchange = function () {
            let file = insertFile.files[0];
            if (file) {
                let reader = new FileReader();
                reader.onload = function(e) {
                    let newImageSrc = e.target.result;
                    updateProfileImages(newImageSrc);
                }
                reader.readAsDataURL(file);
            }
        }
    }
});

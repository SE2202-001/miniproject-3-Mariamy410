// Job class to represent a job listing
class Employment {
    // Constructor to initialize job properties
    constructor(jobTitle, timePosted, category, experience, expertise, description, duration, jobID, jobURL) {
        this.jobTitle = jobTitle;
        this.timePosted = timePosted;
        this.category = category;
        this.experience = experience;
        this.expertise = expertise;
        this.description = description;
        this.duration = duration;
        this.jobID = jobID;
        this.jobURL = jobURL;
    }

    // Method to retrieve a brief summary of the job
    getSummary() {
        return `${this.jobTitle} (${this.category}, ${this.experience})`; // Returns job title, category, and experience level
    }

    // Method to retrieve detailed information about the job
    getDetails() {
        return `Job ID: ${this.jobID}
Title: ${this.jobTitle}
Posted On: ${this.timePosted}
Category: ${this.category}
Experience Level: ${this.experience}
Required Expertise: ${this.expertise}
Duration: ${this.duration}
Description: ${this.description}
Job Link: ${this.jobURL}`;
    }
}

let jobListings = []; // Array to store job data

// Event listener to handle file upload
document.getElementById('fileUpload').addEventListener('change', function(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        const fileReader = new FileReader(); // Create a FileReader instance
        fileReader.onload = function(e) {
            try {
                // Parse the uploaded file and transform it into job objects
                const parsedData = JSON.parse(e.target.result);
                jobListings = parsedData.map(job => new Employment(
                    job.Title,
                    job.Posted,
                    job.Type,
                    job.Level,
                    job.Skill,
                    job.Detail,
                    job["Estimated Time"],
                    job["Job No"],
                    job["Job Page Link"]
                ));

                populateDropdowns(jobListings); // Populate filter dropdowns
                renderJobs(jobListings); // Display all jobs
            } catch (err) {
                // Display error message if JSON parsing fails
                alert('Error processing the uploaded file: ' + err.message);
            }
        };
        fileReader.readAsText(selectedFile); // Read file contents as text
    }
});

// Function to populate filter dropdowns with unique values
function populateDropdowns(jobArray) {
    const categories = new Set();
    const experienceLevels = new Set();
    const skills = new Set();

    // Extract unique values for each filter
    jobArray.forEach(job => {
        categories.add(job.category);
        experienceLevels.add(job.experience);
        skills.add(job.expertise);
    });

    // Populate each filter dropdown with the extracted values
    fillFilterOptions('jobType', categories);
    fillFilterOptions('jobLevel', experienceLevels);
    fillFilterOptions('jobSkill', skills);
}

// Function to populate a specific dropdown filter
function fillFilterOptions(filterID, options) {
    const dropdown = document.getElementById(filterID);
    dropdown.innerHTML = '<option value="">All</option>'; // Default option

    // Add options to the dropdown
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
    });
}

// Event listener to handle filter form submission
document.getElementById('filterForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page reload
    applyFilters(); // Apply filters to job listings
});

// Function to filter and sort job listings
function applyFilters() {
    const selectedCategory = document.getElementById('jobType').value;
    const selectedExperience = document.getElementById('jobLevel').value;
    const selectedSkill = document.getElementById('jobSkill').value;
    const sortingOption = document.getElementById('sort').value;

    // Filter jobs based on selected criteria
    let filteredJobs = jobListings.filter(job => {
        return (selectedCategory === '' || job.category === selectedCategory) &&
               (selectedExperience === '' || job.experience === selectedExperience) &&
               (selectedSkill === '' || job.expertise === selectedSkill);
    });

    // Sort jobs based on the selected sorting option
    if (sortingOption === 'date') {
        filteredJobs.sort((a, b) => new Date(b.timePosted) - new Date(a.timePosted));
    } else if (sortingOption === 'title') {
        filteredJobs.sort((a, b) => a.jobTitle.localeCompare(b.jobTitle));
    }

    renderJobs(filteredJobs); // Display the filtered and sorted jobs
}

// Function to display job listings
function renderJobs(jobArray) {
    const jobContainer = document.getElementById('jobList');
    jobContainer.innerHTML = ''; // Clear existing job listings

    if (jobArray.length === 0) {
        // Display a message if no jobs match the filters
        const noResultsMessage = document.createElement('li');
        noResultsMessage.textContent = 'No jobs match your criteria.';
        noResultsMessage.style.textAlign = 'center';
        jobContainer.appendChild(noResultsMessage);
    } else {
        // Display each job in the array
        jobArray.forEach(job => {
            const jobItem = document.createElement('li');
            jobItem.textContent = job.getSummary(); // Display the job summary
            jobItem.addEventListener('click', () => {
                alert(job.getDetails()); // Show job details on click
            });
            jobContainer.appendChild(jobItem);
        });
    }
}


const form = document.getElementById('coverLetterForm');
const addCompanyBtn = document.getElementById('addCompanyBtn');
const companiesContainer = document.getElementById('companiesContainer');
const submitBtn = document.getElementById('submitBtn');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const outputSection = document.getElementById('outputSection');
const formWrapper = document.querySelector('.form-wrapper');

// Add Company Input Field
addCompanyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addCompanyField();
});

function addCompanyField() {
    const companyInputGroup = document.createElement('div');
    companyInputGroup.className = 'company-input-group';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'company-input';
    input.placeholder = 'Enter company name';
    input.required = true;
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-remove';
    removeBtn.textContent = 'Remove';
    
    companyInputGroup.appendChild(input);
    companyInputGroup.appendChild(removeBtn);
    companiesContainer.appendChild(companyInputGroup);
    
    updateRemoveButtons();
    
    removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        companyInputGroup.remove();
        updateRemoveButtons();
    });
}

function updateRemoveButtons() {
    const companyGroups = companiesContainer.querySelectorAll('.company-input-group');
    companyGroups.forEach((group, index) => {
        const removeBtn = group.querySelector('.btn-remove');
        removeBtn.style.display = companyGroups.length > 1 ? 'block' : 'none';
    });
}

// Form Submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const candidateName = document.getElementById('candidateName').value.trim();
    const jobRole = document.getElementById('jobRole').value.trim();
    const keySkills = document.getElementById('keySkills').value.trim();
    
    // Get all company names
    const companyInputs = companiesContainer.querySelectorAll('.company-input');
    const companies = Array.from(companyInputs)
        .map(input => input.value.trim())
        .filter(name => name.length > 0);
    
    // Validation
    if (!candidateName || !jobRole || companies.length === 0 || !keySkills) {
        showError('Please fill in all required fields.');
        return;
    }
    
    // Show loading state
    showLoading();
    
    try {
        const coverLetter = await generateCoverLetter(
            candidateName,
            jobRole,
            companies,
            keySkills
        );
        
        displayCoverLetter(coverLetter, candidateName, jobRole, companies);
    } catch (error) {
        showError(error.message || 'Failed to generate cover letter. Please try again.');
    }
});

async function generateCoverLetter(candidateName, jobRole, companies, keySkills) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const companyList = companies.join(', ');
    const skillsList = keySkills.split(',').map(skill => skill.trim());
    
    // Generate template-based cover letter
    return createCoverLetterTemplate(candidateName, jobRole, companies[0], companies, skillsList);
}

function createCoverLetterTemplate(candidateName, jobRole, primaryCompany, allCompanies, skills) {
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const hasTech = skills.some(s => 
        s.toLowerCase().includes('python') || 
        s.toLowerCase().includes('javascript') || 
        s.toLowerCase().includes('java') ||
        s.toLowerCase().includes('programming') ||
        s.toLowerCase().includes('coding')
    );
    
    const hasManagement = skills.some(s => 
        s.toLowerCase().includes('management') || 
        s.toLowerCase().includes('leadership') ||
        s.toLowerCase().includes('team')
    );
    
    const hasData = skills.some(s => 
        s.toLowerCase().includes('data') || 
        s.toLowerCase().includes('analytics') ||
        s.toLowerCase().includes('machine learning')
    );
    
    const intro = `I am writing to express my strong interest in the ${jobRole} position at ${primaryCompany}. With a proven track record in ${skills.slice(0, 2).join(' and ')}, I am excited about the opportunity to contribute to your team's success.`;
    
    let skillsParagraph;
    if (hasTech && hasData) {
        skillsParagraph = `Throughout my career, I have developed strong expertise in ${skills.slice(0, 3).join(', ')}, among other technical competencies. My experience spans across multiple domains, enabling me to tackle complex challenges with innovative solutions. I have consistently demonstrated the ability to leverage these skills to drive measurable results and exceed project objectives.`;
    } else if (hasManagement) {
        skillsParagraph = `My professional background encompasses ${skills.slice(0, 3).join(', ')}, with a particular emphasis on ${skills[0]}. I have successfully led cross-functional teams, managed complex projects, and delivered results that align with organizational goals. My experience has equipped me with the tools necessary to excel in fast-paced, dynamic environments.`;
    } else {
        skillsParagraph = `I bring comprehensive experience in ${skills.slice(0, 3).join(', ')}, which I have honed through dedicated professional practice. My proficiency in ${skills[0]} is complemented by strong capabilities in ${skills.slice(1, 3).join(' and ')}, creating a well-rounded skill set that I am eager to apply to the ${jobRole} position.`;
    }
    
    let companyParagraph;
    if (allCompanies.length > 1) {
        companyParagraph = `What particularly attracts me to ${primaryCompany} is your reputation for innovation and excellence in the industry. I have been following your company's growth and am impressed by your commitment to ${hasTech ? 'technological advancement' : hasData ? 'data-driven decision making' : 'professional excellence'}. While I am also exploring opportunities with ${allCompanies.slice(1).join(', ')}, ${primaryCompany} stands out as my preferred choice due to your company culture and industry leadership.`;
    } else {
        companyParagraph = `What particularly draws me to ${primaryCompany} is your organization's reputation for ${hasTech ? 'cutting-edge technology and innovation' : hasData ? 'leveraging data to drive business outcomes' : hasManagement ? 'fostering leadership and professional growth' : 'excellence and commitment to quality'}. Your company's mission aligns perfectly with my professional values and career aspirations, making this opportunity especially compelling.`;
    }
    
    const closing = `I am confident that my background in ${skills.slice(0, 2).join(' and ')}, combined with my passion for ${hasTech ? 'technology and innovation' : hasData ? 'data and analytics' : hasManagement ? 'leadership and team development' : 'professional excellence'}, makes me an ideal candidate for this position. I would welcome the opportunity to discuss how my experience and skills can contribute to ${primaryCompany}'s continued success. Thank you for considering my application, and I look forward to the possibility of speaking with you soon.`;
    
    const coverLetter = `${currentDate}

Dear Hiring Manager,

${intro}

${skillsParagraph}

${companyParagraph}

${closing}

Sincerely,
${candidateName}`;
    
    return coverLetter;
}

function displayCoverLetter(coverLetter, candidateName, jobRole, companies) {
    const coverLetterOutput = document.getElementById('coverLetterOutput');
    coverLetterOutput.textContent = coverLetter;
    
    // Store data for later use
    window.coverLetterData = {
        content: coverLetter,
        candidateName,
        jobRole,
        companies
    };
    
    hideForm();
    showOutput();
    
    // Add event listeners to buttons
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
    document.getElementById('downloadBtn').addEventListener('click', downloadCoverLetterPDF);
    document.getElementById('generateAnotherBtn').addEventListener('click', generateAnother);
}

function showLoading() {
    formWrapper.style.display = 'none';
    loadingState.style.display = 'flex';
    errorState.style.display = 'none';
    outputSection.style.display = 'none';
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    formWrapper.style.display = 'block';
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
    outputSection.style.display = 'none';
}

function hideForm() {
    formWrapper.style.display = 'none';
    loadingState.style.display = 'none';
    errorState.style.display = 'none';
}

function showOutput() {
    outputSection.style.display = 'block';
}

function resetForm() {
    form.reset();
    formWrapper.style.display = 'block';
    loadingState.style.display = 'none';
    errorState.style.display = 'none';
    outputSection.style.display = 'none';
}

function generateAnother() {
    resetForm();
    form.reset();
    
    // Reset companies to single input
    companiesContainer.innerHTML = `
        <div class="company-input-group">
            <input 
                type="text" 
                class="company-input" 
                placeholder="Enter company name"
                required
            />
            <button type="button" class="btn-remove" style="display: none;">Remove</button>
        </div>
    `;
    
    updateRemoveButtons();
}

function copyToClipboard(e) {
    const text = window.coverLetterData.content;
    const btn = e.currentTarget;
    
    // Use the modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            btn.style.backgroundColor = '#10b981';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopyToClipboard(text, btn);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(text, btn);
    }
}

function fallbackCopyToClipboard(text, btn) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            btn.style.backgroundColor = '#10b981';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
            }, 2000);
        } else {
            alert('Failed to copy to clipboard');
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Failed to copy to clipboard');
    }
    
    document.body.removeChild(textArea);
}

function downloadCoverLetterPDF() {
    const { jsPDF } = window.jspdf;
    const { content, candidateName } = window.coverLetterData;
    
    // Create new PDF document
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    // Set font
    doc.setFont('helvetica');
    doc.setFontSize(11);
    
    // Define margins and page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    const maxLineWidth = pageWidth - (margin * 2);
    
    // Split content into lines
    const lines = content.split('\n');
    let yPosition = margin;
    const lineHeight = 7;
    
    lines.forEach(line => {
        if (line.trim() === '') {
            // Empty line - add spacing
            yPosition += lineHeight;
        } else {
            // Split long lines to fit page width
            const splitLines = doc.splitTextToSize(line, maxLineWidth);
            
            splitLines.forEach(splitLine => {
                // Check if we need a new page
                if (yPosition + lineHeight > pageHeight - margin) {
                    doc.addPage();
                    yPosition = margin;
                }
                
                doc.text(splitLine, margin, yPosition);
                yPosition += lineHeight;
            });
        }
    });
    
    // Save the PDF
    const fileName = `Cover_Letter_${candidateName.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
}

// Initialize remove button visibility
updateRemoveButtons();

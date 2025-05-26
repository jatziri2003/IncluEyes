    const progressBar = document.getElementById('progressBar');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById("submitBtn");

    const totalSteps = 7;
    let currentStep = 1;

    function actualizar_estadoBtn() {
        document.getElementById("prevBtn").disabled = currentStep <= 1;
        document.getElementById("nextBtn").disabled = currentStep >= 7;
        // Mostrar el botón "Enviar" solo en el paso 7
        if (currentStep === 7) {
            submitBtn.style.display = "inline-block";
        } else {
            submitBtn.style.display = "none";
        }
    }

    

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
        const percent = (100 / totalSteps) * currentStep;
        progressBar.style.width = percent + '%';
        progressBar.textContent = `${currentStep} de ${totalSteps}`;
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
        const percent = (100 / totalSteps) * currentStep;
        progressBar.style.width = percent + '%';
        progressBar.textContent = `${currentStep} de ${totalSteps}`;
        }
    });

    function showStep(step) {
    document.querySelectorAll(".form-step").forEach((el, index) => {
        el.style.display = (index + 1 === step) ? "block" : "none";
    });
    }

    function nextStep() {
    currentStep++;
    showStep(currentStep);
    actualizar_estadoBtn()
    }

    function prevStep() {
    currentStep--;
    showStep(currentStep);
    actualizar_estadoBtn()
    }
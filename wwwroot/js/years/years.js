let placeID;
document.addEventListener('DOMContentLoaded', () => {
    placeID = $('#placeID').val();
    toggleSection('suggested', 'See all');
    toggleSection('activities');
    initSwipers();

    document.querySelectorAll('button[id*="faq-"]').forEach(button => {
        button.addEventListener('click', () => onClickFAQInfo(button));
    });
});
(function () {
    // The function will be triggered only when the DOM is ready to not make the ajax request witout the payload
    document.addEventListener("DOMContentLoaded", function () {
        // Function to be triggered when the top selling packages review is visible
        let isVisible = false;
        function onTopSellPacksVisible(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isVisible) {
                    isVisible = true;
                    // Trigger your desired function here
                    getTop3Feedbacks(placeID);
                    observer.unobserve(entry.target);
                }
            });
        }
        // Create the observer
        const observer = new IntersectionObserver(onTopSellPacksVisible, {
            root: null,       // Observe the viewport
            threshold: 0.1    // Trigger when at least 10% of the footer is visible
        });
        // Observe the review element
        const review = document.querySelector('#customerReviews');
        observer.observe(review);
    });
})()
async function getTop3Feedbacks(countryId) {
    const url = `/Api/Top3FeedbackByCounId/${countryId}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json;charset=utf-8' }
        });

        if (response.status === 204) {
            //No feedback found
            return;
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();

        // No data
        if (!data) return;

        //Creating markup
        let markup = "";
        data.forEach(function (item) {
            markup += `<li class="customer-reviews__item">${renderFeedback(item)}</li>`
        })
        $('#dReview').html(markup);

    } catch (error) {
        console.error('API getTop3Feedbacks: Request failed', error.message);
    }
};
function renderFeedback(data) {
    const date = new Date(data.dep_date).toLocaleDateString('en-US');
    const markup = `
                <div>
                    <div class="customer-reviews__wrapper">
                        <span class="customer-reviews__stars" style="--rating: ${data.pcc_overallscore}"></span>
                        <div class="customer-reviews__score">${data.pcc_overallscore} out of 5</div>
                    </div>
                    <p class="customer-reviews__text">${data.pcC_Comment}</p>
                </div>
                <span class="customer-reviews__date">Traveled on: ${date}</span>
                `;

    return markup;
}
function toggleSection(name, showMoreText = 'Show More') {
    const button = document.getElementById(`${name}ToggleButton`);
    if (!button) return;

    button.addEventListener('click', () => {
        const list = document.getElementById(`${name}List`);
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        list.classList.toggle('expanded', !isExpanded);
        button.setAttribute('aria-expanded', (!isExpanded).toString());

        const buttonSpan = button.querySelector('span');
        if (buttonSpan) {
            buttonSpan.textContent = isExpanded ? showMoreText : 'Show less';
        } else {
            button.textContent = isExpanded ? showMoreText : 'Show less';
        }
    });
}
function initSwipers() {

    new Swiper(`#swiper`, {
        navigation: {
            nextEl: `.swiper-button-next`,
            prevEl: `.swiper-button-prev`,
        },
        breakpoints: {
            // when window width is >= 320px
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            // when window width is >= 768px
            768: {
                slidesPerView: 3,
                spaceBetween: 20
            }
        }
    });

}
function onClickFAQInfo(el) {
    const idNumber = el.id.split('-')[1];
    const item = document.getElementById(`faqItem-${idNumber}`);
    if (!item) return;

    const isExpanded = el.getAttribute('aria-expanded') === 'true';
    item.classList.toggle('expanded', !isExpanded);
    el.setAttribute('aria-expanded', (!isExpanded).toString());

    const submenu = document.getElementById(`faqInfo-${idNumber}`);

    if (submenu.style.maxHeight) {
        submenu.style.maxHeight = null;
    } else {
        submenu.style.maxHeight = submenu.scrollHeight + "px";
    }
}
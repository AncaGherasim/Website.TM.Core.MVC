$(function () {
	strPlcsIDs = $('#strPlcsIDs').val();
	/*getPackFeedbacks(strPlcsIDs);*/

	const suggestedButton = document.getElementById('suggestedButton');

	suggestedButton.addEventListener('click', showMoreSuggested);
});

function getPackFeedbacks(filterIds) {
	const url = `${SiteName}/Api/PackFeedbacks/${filterIds}`;
	fetch(url, {
		method: 'GET',
		headers: {
			contentType: 'application/json;charset=utf-8'
		}
	})
		.then(response => {
			if (!response.ok) {
				return response.text().then(text => { throw new Error(text) });
			}
			return response.json();
		})
		.then(data => {
			if (Array.isArray(data)) {
				data.forEach(item => {
					document.querySelector('.packages__description-' + item.pcC_PDLID).innerHTML = item.pcC_Comment;
					document.querySelector('.packages__date-' + item.pcC_PDLID).innerHTML = "Traveled on: " + item.dep_date;
				});
			}
			else {
				console.error('Invalid response format:', data);
			}
		})
		.catch(error => {
			// Handle errors
			console.error('Error fetching data of PackFeedbacks :', error.message);
		});
}


function showMoreSuggested() {
	const list = document.getElementById('suggestedList');
    list.classList.add('expanded');
	this.style.display = "none";
}
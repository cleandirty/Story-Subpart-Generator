function generateSubparts() {
  const inputStory = document.getElementById('inputStory').value.trim();
  const outputDiv = document.getElementById('output');

  function processStory(story) {
      const subparts = [];
      let currentSubpart = '';

      for (let i = 0; i < story.length; i++) {
          if (story[i] === '{' && story[i + 1] === '}') {
              i = i + 2;
              currentSubpart = story.substring(i, i + 300);
              const lastPunc = Math.max(currentSubpart.lastIndexOf('.'), currentSubpart.lastIndexOf(','));
              subparts.push(story.substring(i, lastPunc + 1 + i));
              currentSubpart = '';
              i = i + lastPunc;
          } else {
              currentSubpart = story.substring(i, i + 400);
              const lastPunc = Math.max(currentSubpart.lastIndexOf('.'), currentSubpart.lastIndexOf(','));
              if (lastPunc !== -1 && currentSubpart.indexOf('{') === -1) {
                  subparts.push(story.substring(i, lastPunc + 1 + i));
                  currentSubpart = '';
                  i = i + lastPunc;
              } else {
                  subparts.push(story.substring(i, currentSubpart.lastIndexOf('{') + i));
                  i = i + currentSubpart.lastIndexOf('{') - 1;
                  currentSubpart = '';
              }
          }
      }

      return subparts;
  }

  const subparts = processStory(inputStory);

  const slides = [];

  subparts.forEach(text => {
      const type = text.length < 300 ? "2by4" : "2by5";

      const slide = {
          text: [text],
          image: `https://cleandirty.s3.ap-south-1.amazonaws.com/The+Assignment/${type}/Shot+01.png`,
          type: type
      };

      slides.push(slide);
  });

  const jsonData = { slides };

  // Convert the JSON object to a string
  const jsonString = JSON.stringify(jsonData, null, 2);

  // Display subparts with labels
  outputDiv.innerHTML = subparts.map((subpart, index) => `<p>Subpart ${index + 1} (${subpart.length}) : ${subpart}</p>`).join('');

  // Download the JSON file
  downloadJSON(jsonString);
}

function downloadJSON(jsonString) {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'generated_story.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

let generatedJSON = '';
let storyname = "";

function generateSubparts() {
  storyname = document.getElementById('Storyname').value.trim();
  const inputStory = document.getElementById('inputStory').value.trim();
  const outputDiv = document.getElementById('output');
  storyname = storyname.split(' ').join('+');
  console.log(storyname);

  function processStory(story) {
      const subparts = [];
      let currentSubpart = '';

      for (let i = 0; i < story.length; i++) {
          if (story[i] === '{' && story[i + 1] === '}') {
              i = i + 2;
              currentSubpart = story.substring(i, i + 300);
              const lastPunc = Math.max(currentSubpart.lastIndexOf('.'), currentSubpart.lastIndexOf(','),currentSubpart.lastIndexOf('”'));
              subparts.push([story.substring(i, lastPunc + 1 + i),"2by4"]);
              currentSubpart = '';
              i = i + lastPunc;
          } else {
              currentSubpart = story.substring(i, i + 400);
              const lastPunc = Math.max(currentSubpart.lastIndexOf('.'), currentSubpart.lastIndexOf(','),currentSubpart.lastIndexOf('”'));
              console.log(currentSubpart.indexOf('{') === -1)
              if (lastPunc !== -1 && currentSubpart.indexOf('{') === -1) {
                  subparts.push([story.substring(i, lastPunc + 1 + i),"2by5"]);
                  currentSubpart = '';
                  i = i + lastPunc;
              } else {
                  subparts.push([story.substring(i, currentSubpart.lastIndexOf('{') + i),"2by5"]);
                  console.log(story.substring(i, currentSubpart.lastIndexOf('{') + i),"2by5")
                  i = i + currentSubpart.lastIndexOf('{') - 1;
                  currentSubpart = '';
              }
          }
      }

      return subparts;
  }

  const subparts = processStory(inputStory);
  console.log(subparts);

  const slides = [];
  let count = 0;

  subparts.forEach(text => {

      const type = text[1];
      if(type.match("2by4")){
        count++;
      }
      const slide = {
          text: [text[0]],
          image: `https://cleandirty.s3.ap-south-1.amazonaws.com/${storyname}/${type}/Shot+0${count}.png`,
          type: type
      };
      slides.push(slide);
  });

  const jsonData = { slides };

  // Convert the JSON object to a string
  generatedJSON = JSON.stringify(jsonData, null, 2);

  // Display subparts with labels
  outputDiv.innerHTML = subparts.map((subpart, index) => `<p>Subpart ${index + 1} (${subpart[0].length}) (${subpart[1]}) : ${subpart[0]}</p>`).join('');

  
}

function downloadJSON() {
  // Check if JSON is generated
  if (generatedJSON) {
    const blob = new Blob([generatedJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${storyname}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    alert('Generate subparts first!');
  }
}

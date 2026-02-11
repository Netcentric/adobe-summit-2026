export default function decorate(block) {
  const [leftDiv, rightDiv] = block.firstElementChild.children;

  const orientation = leftDiv.querySelector('picture') ? 'left' : 'right';
  block.classList.add(`textimage--orientation-${orientation}`);

  const pictureDiv = orientation === 'left' ? leftDiv : rightDiv;
  const textDiv = orientation === 'left' ? rightDiv : leftDiv;

  const orgTitleH2Node = textDiv.querySelector('h2');
  let titleH2 = null;
  if (orgTitleH2Node) {
    titleH2 = orgTitleH2Node.cloneNode(true);
    orgTitleH2Node.remove();
  }

  block.innerHTML = `
    ${titleH2 ? `<header class="textimage__header">${titleH2.outerHTML}</header>` : ''}
    <div class="textimage__image">
        ${pictureDiv.innerHTML}
    </div>
    <div class="textimage__text">
        ${textDiv.innerHTML}
    </div>
  `;  
}
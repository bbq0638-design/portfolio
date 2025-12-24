document.addEventListener("click", function (e) {
  let target = e.target;


  while (target && target.tagName !== "A") {
    target = target.parentNode;
  }
  if (!target) return; 


  let card = target.parentNode;
  while (card && !(card.classList && card.classList.contains("message_list"))) {
    card = card.parentNode;
  }
  if (!card) return;


  e.preventDefault();
  const badge = card.querySelector(".unread");
  if (badge) badge.remove();
});
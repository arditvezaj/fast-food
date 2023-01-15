const addToCartButtons = document.getElementsByClassName("food");
for (let i = 0; i < addToCartButtons.length; i++) {
  const button = addToCartButtons[i];
  button.addEventListener("click", addToCartClicked);
}

addToCartButtons.addEventListener("click", addToCart)

function addToCart(event) {
  const button = event.target;
  console.log(button);
}

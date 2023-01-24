const addToCartButtons = document.getElementsByClassName("food");
for (let i = 0; i < addToCartButtons.length; i++) {
  const button = addToCartButtons[i];
  button.addEventListener("click", addToCartClicked);

  function addToCartClicked(event) {
    const button = event.target;
    const foodItem = button.parentElement.parentElement;
    const title = foodItem.getElementsByClassName("card-title")[0].innerText;
    const price = foodItem.getElementsByClassName("card-price")[0].innerText;
    const imageSrc = foodItem.getElementsByClassName("card-img-top")[0].src;
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
  }

  function addItemToCart(title, price, imageSrc) {
    const cartRow = document.createElement("div");
    cartRow.classList.add("cart-row");
    //te qiky rreshti posht o problemi nuk po mundem me ju qas cart-items
    // ne faqen cart.ejs qe tani me insertu kete div me te dhenat e ushqimit
    const cartItems = document.getElementsByClassName("cart-items")[0];
    const cartItemNames = cartItems.getElementsByClassName("card-item-title");
    for (let i = 0; i < cartItemNames.length; i++) {
      if (cartItemNames[i].innerText == title) {
        alert("This food is already added to the cart!");
        return;
      }
    }
    const cartRowContents = `
      <div class="cart-item cart-column">
              <img class="cart-item-image" src=${imageSrc} width="100" height="100">
             <span class="cart-item-title">${title}</span>
         </div>
         <span class="cart-price cart-column">${price}</span>
         <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">Remove</button>
       </div>`;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);

    cartRow
      .getElementsByClassName("btn-danger")[0]
      .addEventListener("click", removeCartItem);
    cartRow
      .getElementsByClassName("cart-quantity-input")[0]
      .addEventListener("change", quantityChanged);
  }
}

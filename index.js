'use strict';

// import renderCards from './modules/renderCards';
// import renderCatalog from './modules/renderCatalog';
// import toggleCheckBox from './modules/toggleCheckBox';
// import toggleCart from './modules/toggleCart';
// import addCart from './modules/addCart';
// import actionPage from './modules/actionPage';
//import getData from './modules/getData';


//получение данных с сервера
function getData() {
    const itemsWrapper = document.querySelector('.items-wrapper');
    return fetch('../db/db.json')
    .then((response) => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error ('Данные не были получены, ошибка: ' + response.status);
        }
    })
    .then(data => { //jsonplaceholder.com
        return data;
    })
    .catch(err => {
        console.warn(err);
        itemsWrapper.innerHTML = '<div style="font-size: 25px"">Упс, что-то пошло не так. :(</div>';
    });
}
//end получение данных с сервера


//выводим товары
function renderItems(data) {

    console.log(localStorage.getItem('male'));
    console.log(localStorage.getItem('category'));
    console.log(localStorage.getItem('sale'));
    console.log(localStorage.getItem('sort'));




    //SORT__________________________
    const sortMax =  document.querySelector('#items-sort-max-price'),
          sortMin =  document.querySelector('#items-sort-min-price'),
          lenPage = localStorage.getItem('count_items');

    if (localStorage.getItem('sort') === 'max') {
        sortMax.classList.add('sort-active');
        data.items.sort((a, b) => {
            return a.price - b.price;
            });
       
    } else if (localStorage.getItem('sort') === 'min') {
        sortMin.classList.add('sort-active');
        data.items.sort((a, b) => {
            return  b.price - a.price;
            });
    }
    //SORT__________________________

    //SALE__________________________
    const discount =  document.querySelector('#items-discount');
    if (localStorage.getItem('sale') === 'true') {
        discount.classList.add('sort-active');
    }
    //SALE__________________________

    const itemsWrapper = document.querySelector('.items-wrapper');
    let iArr = 1,
        iPage = 1,
        iFotorama = 1,
        numberPage;
    data.items.forEach((item) => {
        if (localStorage.getItem('male') === item.male || localStorage.getItem('male') === 'all') {
            if ((localStorage.getItem('category') === item.category) || (localStorage.getItem('category') === "all")) {
                if ((( localStorage.getItem('sale') === 'true' ) && (item.sale == true)) || ( localStorage.getItem('sale') === 'false' )) {
                    //div
                    const card = document.createElement('div');
                    card.className = 'col-md-4 col-sm-6 col-xs-12 item_rab' +
                     (item.sale ? ' item_sale' : "");
                    card.setAttribute('data-number', iArr);
                    card.setAttribute('data-page', iPage);
                    card.innerHTML = `
                        <div class="item-cart">
                            <div id="fotorama${iFotorama}" class="fotorama">
                                <img src="${item.img1}">
                            </div>
                            <div class="item-text-wrapper">
                            <p id="item_name">${item.title_declaration} "${item.title_name}"</p>
                            <strong id="item_price" ${item.sale ? 'style="color: red"' : "" }>${item.price}</strong>
                            <img class="item-cart-ruble" src="./img/detail/ruble.png" alt="">
                            <div class="buttons-wrapper">
                                <button class="item-button item-button-full">Подробнее</button>
                                <button class="item-button item-button-basket"><img class="item-button-img" src="./img/items/basket.png" alt=""></button>
                                <button class="item-button item-button-heart"><img class="item-button-img" src="./img/items/heart.png" alt=""></button>
                            </div>
                            <button class="item-green-button order-item-button">ЗАКАЗАТЬ</button>
                            </div>
                        </div>
                    `;
                    
                    itemsWrapper.appendChild(card);
                    
                    const itemFullButton = card.querySelector('.item-button-full');

                    itemFullButton.addEventListener('click', () => {
                        localStorage.setItem('number_detail', item.id );
                        document.location.href = "detail.html";
                    });

                    const basketButton = card.querySelector('.item-button-basket');
                    basketButton.addEventListener('click', () => {
                        let basket;
                        if ( ( (localStorage.getItem('basket_items')) == null ) || ((localStorage.getItem('basket_items')) == "" ) ) {
                            basket = [];
                            localStorage.setItem('basket_items', JSON.stringify(basket)); 
                        }
                        basket = JSON.parse(localStorage.getItem('basket_items'));

                        let counted = false;
                        basket.forEach((i) => {
                            if (i.id === item.id) {
                                counted = true;
                                i.count += 1;
                            }
                        });
                        if (!counted) {
                            basket.push({'id': item.id, 'count': 1});
                        } 
                        localStorage.setItem('basket_items', JSON.stringify(basket));
                        console.log('BASKET:'+(localStorage.getItem('basket_items')));
                        const buttonImg = basketButton.querySelector('.item-button-img');
                        buttonImg.setAttribute('src', './img/items/black_basket.png');
                        console.log(buttonImg);

                        //  localStorage.removeItem('basket_items');
                    });

                    const likeButton = card.querySelector('.item-button-heart');
                    likeButton.addEventListener('click', () => {
                        // let like;
                        // if ( ( (localStorage.getItem('basket_items')) == null ) || ((localStorage.getItem('basket_items')) == "" ) ) {
                        //     basket = [];
                        //     localStorage.setItem('basket_items', JSON.stringify(basket)); 
                        // }
                        // basket = JSON.parse(localStorage.getItem('basket_items'));

                        // let counted = false;
                        // basket.forEach((i) => {
                        //     if (i.id === item.id) {
                        //         counted = true;
                        //         i.count += 1;
                        //     }
                        // });
                        // if (!counted) {
                        //     basket.push({'id': item.id, 'count': 1});
                        // } 
                        // localStorage.setItem('basket_items', JSON.stringify(basket));
                        // console.log('BASKET:'+(localStorage.getItem('basket_items')));
                        const buttonImg = likeButton.querySelector('.item-button-img');
                        buttonImg.setAttribute('src', './img/items/black_heart.png');
                        console.log(buttonImg);

                        //  localStorage.removeItem('basket_items');
                    });



                    //Count++
                    iFotorama++;
                    if(iArr === lenPage) {
                        iArr = 1;
                        iPage++;
                    } else {
                        iArr++;
                    }
                    //card.style.display = 'none';
                } 
            }
        }
        
        //order__item_______________________________
        $('.order-item-button').on('click', function(event) {
            event.preventDefault();
            localStorage.setItem('send_type', 'order_item');
            localStorage.setItem('number_detail', item.id );
            $('.send_popup .main-form-btn').text('ЗАКАЗАТЬ');
            $('.send_popup').show('fade', 300);
        });
        //order__item_______________________________

    });


    //pages_________________________________________
    const items = document.querySelectorAll('.item_rab');
    const buttonsWrapper = document.querySelector('.pages-buttons-wrapper');


    const showButton = document.querySelector('.show-number-button');
    const textShowButton = showButton.querySelector('.set_count_items');
    switch(localStorage.getItem('count_items')) {
        case '9':
            textShowButton.textContent = 'Show 12';
        break;
        
        case '12':
            textShowButton.textContent = 'Show 24';
        break;
            
        case '24':
            textShowButton.textContent = 'Show 9';
        break;
    }
    showButton.addEventListener('click', () => {
        
        switch(localStorage.getItem('count_items')) {
            case '9':
                localStorage.setItem('count_items', '12');
                textShowButton.textContent = 'Show 12';
            break;
            
            case '12':
                localStorage.setItem('count_items', '24');
                textShowButton.textContent = 'Show 24';
            break;
                
            case '24':
                localStorage.setItem('count_items', '9');
                textShowButton.textContent = 'Show 9';
            break;
            }
        document.location.href = "items.html";
    });


    //changePage____________________________________
    function changePage(numberPage) {   
        items.forEach( item => {
            console.log(numberPage);
            if(item.getAttribute('data-page') == numberPage) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            } 
        });
        const buttons = document.querySelectorAll('.current_buttons');
        console.log("/______________________");
        console.log(buttons);
        console.log(buttons[0]);
        console.log("/______________________");
        buttons.forEach((button) => {
            button.style.display = 'none';
           // button.setAttribute('disabled', 'false');
        });
        for(let i = 1; i <= iPage; i++) {
            buttons[i-1].textContent = i;
        }
        buttons[0].style.display = 'block';
        console.log(iPage);
        buttons[iPage-1].style.display = 'block';
        console.log(iPage);
        if((numberPage !== iPage) && (numberPage !== 1) ) {
            buttons[numberPage - 1].style.display = 'block';
        }
        if(numberPage + 1 < iPage) {
            buttons[numberPage].style.display = 'block';
            console.log(numberPage + 2);
            console.log(iPage);
            console.log(!(numberPage + 2 === iPage));
            if(!(numberPage + 2 === iPage)) {
                const p = buttons[numberPage+1].firstChild;
                p.textContent = '...';
              //  buttons[numberPage+1].setAttribute('disabled', 'true');
                buttons[numberPage+1].style.display = 'block';
            }
        }
        if(numberPage - 1 > 1) {
            buttons[numberPage - 2].style.display = 'block';
            if(numberPage - 2 !== 1) {
                const p = buttons[numberPage-3].firstChild;
                p.textContent = '...';
             //   buttons[numberPage-3].setAttribute('disabled', 'true');
                buttons[numberPage - 3].style.display = 'block';
            }
        }

        // let lItem = 1;
        // items.forEach(item => {
        //     if(item.style.display === 'block') {
        //         console.log('IF___________________');
        //         console.log(lItem);
        //         console.log($(('#fotorama'+ lItem)));
        //         //const fotoramaDiv = item.querySelector('.fotorama');
        //         let fotorama = $('#fotorama1').data('fotorama');
        //         console.log(fotorama);
        //         console.log( data.items[0].images_quantity);
        //         console.log(data.items);
        //         console.log(data.items[0]);
        //         console.log(data.items[0]['img'+2]);
        //         for(let l = 1; l <= data.items[0].images_quantity; l++) {
                    
        //             fotorama.push({ img: (data.items[0]['img'+l]) });

        //             console.log('PUSH___');
        //             console.log(fotorama);
        //         }



        //         $('.fotorama').fotorama({
        //             width: 374,
        //             height: 351,
        //         //   height: $('.detailed-wrapper').height, 
        //             ratio: 16/9,
        //             allowfullscreen: true
        //         });




        //         console.log('IF___________________');
        //     }
        //     lItem++;
        // });





    }
    //changePage____________________________________


//currentButtons__________________________________________

    let prevButton = document.createElement('div');
    prevButton.className = 'pages-button-wrapper';
    let nextButton = document.createElement('div');
    nextButton.className = 'pages-button-wrapper';



    prevButton.innerHTML = `
        <button class="pages-white-button left-page"><p><</p></button>
        `;
    
    buttonsWrapper.append(prevButton);
    console.log(prevButton);

    for(let i = 1; i <= iPage; i++) {
        let iButton = document.createElement('div');
        iButton.className = 'pages-button-wrapper';
        iButton.innerHTML = `
        <button class="pages-white-button current_buttons page${i}"><p>${i}</p></button>
        `;
        console.log(iButton);
        buttonsWrapper.append(iButton);
        console.log(buttonsWrapper);
    }

    nextButton.innerHTML = `
        <button class="pages-white-button right-page"><p>></p></button>
        `;
        console.log(nextButton);
    buttonsWrapper.append(nextButton);
    console.log(buttonsWrapper);

    numberPage = 1;
    changePage(1);
    $('.left-page').on('click', function(event) {
        event.preventDefault();
        if(numberPage > 1) {
            numberPage--;
            changePage(numberPage);
        }
    });
    $('.right-page').on('click', function(event) {
        event.preventDefault();
        console.log(iPage);
        if(numberPage < iPage) {
            numberPage++;
            changePage(numberPage);
        }
    });
    for(let i = 1; i <= iPage; i++) {
        const currentButton = document.querySelector('.' + 'page' + i);
        currentButton.addEventListener('click', () => {
            changePage(i);
        });
    }

    //currentButtons__________________________________________
    //pages___________________________________________________




    //nav and category_nav_________________________________________
    const navMale = document.querySelector('.get_male'),
          navCategory = document.querySelector('.get_category'),
          navWrapper = document.querySelector('.nav-items-li-wrapper');
    if (localStorage.getItem('category') === 'all') {
        navCategory.textContent = 'Всё';
    } else {
        navCategory.textContent = localStorage.getItem('category');
    }
    if(localStorage.getItem('male') === 'man') {
        navMale.textContent = 'Мужчины';
    } else if(localStorage.getItem('male') === 'woman'){
                navMale.textContent = 'Женщины';
            } else {
                navMale.textContent = 'Акции';
            }

    if(localStorage.getItem('male') === 'man') {
        const nav = document.createElement('div');
        nav.className = 'nav-wrapper';
        nav.innerHTML = `
        <ul>
            <li id="nav_menu_man_sum" class="li-width"><a href="items.html">СУМКИ</a></li>
            <li id="nav_menu_man_sac" class="li-width"><a href="items.html">САКВОЯЖИ</a></li>
            <li id="nav_menu_man_dor_sum" class="li-width"><a href="items.html">ДОРОЖНЫЕ СУМКИ</a></li>
            <li id="nav_menu_man_por" class="li-width"><a href="items.html">ПОРТФЕЛИ</a></li>
            <li id="nav_menu_man_ruc" class="li-width"><a href="items.html">РЮКЗАКИ</a></li>
            <li id="nav_menu_man_cla" class="li-width"><a href="items.html">КЛАТЧИ</a></li>
            <li id="nav_menu_man_port" class="li-width"><a href="items.html">ПОРТМОНЕ</a></li>
        </ul>
        `;
        navWrapper.appendChild(nav);
    } else {
        const nav = document.createElement('div');
        nav.className = 'nav-wrapper';
        nav.innerHTML = `
            <li id="nav_menu_woman_sum" class="li-width"><a href="items.html">СУМКИ</a></li>
            <li id="nav_menu_woman_sac" class="li-width"><a href="items.html">САКВОЯЖИ</a></li>
            <li id="nav_menu_woman_ruc" class="li-width"><a href="items.html">РЮКЗАКИ</a></li>
            <li id="nav_menu_woman_cla" class="li-width"><a href="items.html">КЛАТЧИ</a></li>
            <li id="nav_menu_woman_port" class="li-width"><a href="items.html">ПОРТМОНЕ</a></li>
        </ul>
        `;
        navWrapper.appendChild(nav);
    }
    //nav and category_nav_________________________________________

    



    // for(let i = 0; i < items.length; i++) {
    //     console.log(items[i]);
    //     console.log(items[i].getAttribute('data-number'));

    //     if((items[i].getAttribute('data-number')) == i+1) {
    //         items[i].style.display = 'block';
    //     }
    // }
    //pages_________________________________________

}
// end выводим товары






//подробнее
function renderDetail(data) {

    const detailedTextWrapper = document.querySelector('.detailed-text-wrapper'),
          i = parseFloat(localStorage.getItem('number_detail'));
          let items = data.items;
            //div
           const card = document.createElement('div');
            card.className = 'detailed_item';
            card.innerHTML = `
                  <div class="detailed-text-header-wrapper">
                      <h3>${items[i].title_declaration} "${items[i].title_name}"</h3>
                      <img class="after-line"src="./img/detail/line.png" alt="">
                  </div>
                  <p>${items[i].detail}</p>
                  <span>Материал:                </span> 
                  <span>${items[i].material}</span> <br>
                  <img src="./img/detail/longLine.png" alt="">
                  <br>
                  <span>Цвет:</span> 
                  <span>${items[i].color}</span> <br>
                  <img src="./img/detail/longLine.png" alt="">
                  <br>
                  <span>Размер:</span> 
                  <span>${items[i].size}</span> <br>
                  <img src="./img/detail/longLine.png" alt="">
                  <br>
                  <span>Изготовление:</span> 
                  <span>${items[i].made}</span> <br>
                  <img src="./img/detail/longLine.png" alt="">
                  <br>
                  <span>Срок изготовления:</span> 
                  <span>${items[i].time_made}</span>
                  <br>
                  <div class="price-wrapper">
                      <p class="price">${items[i].price} </p>
                      <img class="ruble" src="./img/detail/ruble.png" alt="">
                  </div>
                  <br>
                  
                  <button class="green-button order_button">БЫСТРЫЙ ЗАКАЗ</button> <br>
                  <button class="add-basket-button">ДОБАВИТЬ В КОРЗИНУ</button> <br>
            `;
        detailedTextWrapper.appendChild(card);



        //FOTORAMA_____________________________________________________
        let fotorama = $('#delail_fotorama').data('fotorama');
        for(let l = 1; l <= items[i].images_quantity; l++) {
            fotorama.push({img: (items[i]['img'+l]), thumb: (items[i]['img'+l])});
        }
        const detailedRowWrapper = document.querySelector('.detailed-wrapper');
        console.log($('#detailed_row_width'));
        console.log(detailedRowWrapper.clientWidth);
        $('.fotorama').fotorama({
            width: 0.55 * detailedRowWrapper.clientWidth,
            height: 600,
         //   height: $('.detailed-wrapper').height, 
            ratio: 16/9,
            allowfullscreen: true,
            nav: 'thumbs'
           });

        

        //    $('window').on('onchange', function(event) {
        //     const detailedRowWrapper = document.querySelector('.container');
        //     event.preventDefault();
        //     console.log('||||ONCHANGE__________________________________');
        //     if (detailedRowWrapper.clientWidth > 1200) {
        //         $('.fotorama').fotorama({
        //             width: 0.55 * detailedRowWrapper.clientWidth,
        //            });
        //     } else {
        //         $('.fotorama').fotorama({
        //             width: detailedRowWrapper.clientWidth,
        //            });
        //     }
        // });
          
        console.log(fotorama);
        //$( ".fotorama" ).load(window.location.href + " .fotorama" );
        //FOTORAMA_____________________________________________________



        const basketButton = card.querySelector('.add-basket-button');

        basketButton.addEventListener('click', () => {
            let basket;
            if ( ( (localStorage.getItem('basket_items')) == null ) || ((localStorage.getItem('basket_items')) == "" ) ) {
                basket = [];
                localStorage.setItem('basket_items', JSON.stringify(basket)); 
            }
            basket = JSON.parse(localStorage.getItem('basket_items'));

            let counted = false;
            basket.forEach((iBasket) => {
                if (iBasket.id === items[i].id) {
                    counted = true;
                    iBasket.count += 1;
                }
            });
            if (!counted) {
                basket.push({'id': items[i].id, 'count': 1});
            } 
            localStorage.setItem('basket_items', JSON.stringify(basket));
            console.log('BASKET:'+(localStorage.getItem('basket_items')));
            //localStorage.removeItem('basket_items');
        });

        
    //order_________________________________
    $('.order_button').on('click', function(event) {
        event.preventDefault();
        localStorage.setItem('send_type', 'order');
        $('.send_popup .main-form-btn').text('ЗАКАЗАТЬ');
        $('.send_popup').show('fade', 300);
    });
    //end_order_________________________________

}
// end подробнее


















//Корзина
function renderBasket(data) {

    const itemsWrapper = document.querySelector('.items-wrapper'),
          numbers = JSON.parse(localStorage.getItem('basket_items'));
    let items = data.items;

    if ((JSON.parse(localStorage.getItem('basket_items'))).length == 0 ) {
        const card = document.createElement('div');
        card.className = 'row basket-item';
                //HIGHT_______________________________________________________________
        card.innerHTML = `
            <div class="col-md-12" style="  ">                
                <div class="basket-fill-item" style="width: 100%; margin-left: 0px; border-top: none; height: 500x"> 
                    <strong style="width: 100%; text-align: center;">Ваша корзина пуста...</strong>
                </div>
            </div>
        `;
        itemsWrapper.appendChild(card);
    } else {
        numbers.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'row basket-item';
            card.innerHTML = `
                <div class="basket-img-wrapper" number_id="${items[item.id].id}">
                    <img class="item-img" src="${items[item.id].img1}" alt="">
                </div>
                <div class="basket-fill-item">
                    <div class="basket-fill-p-wrapper">
                    <p class="basket-gray-text">Наименование</p>
                    <p class="basket-gray-text">Количество</p>
                    <p class="basket-gray-text">Стоимость</p>
                    <p class="basket-gray-text">Сумма</p>
                    </div>
                    <img src="./img/basket/long_line.png" alt="" class="basket-line">
                    <div class="basket-price-wrapper">
                    <strong class="name-strong">${items[item.id].title_declaration} "${items[item.id].title_name}"</strong>
                    <div class="basket-buttons-wrapper">
                    <button class="basket-gray-button basket_down_button"><img src="./img/basket/down.png" alt=""></button>
                    <button  class="number-items">${item.count}</button>
                    <button class="basket-gray-button basket_up_button"><img src="./img/basket/up.png" alt=""></button>
                    </div>
                    <p class="basket-gray-color">${items[item.id].price} <img class="basket-ruble" src="./img/basket/gray-ruble.png" alt=""></p>
                    <div class="price-wrapper">
                    <strong class="item_total_price price-strong">${items[item.id].price*item.count} </strong>
                    <img class="basket-bad-ruble" src="./img/basket/ruble.png" alt="">
                    
                    </div>
                    <div class="basket-buttons-wrapper">
                        <p class="p-button p_like">Отложить</p>
                        <p class="p-button p_delete">Удалить</p>
                    </div>
                    </div>
                </div>
            `;
            itemsWrapper.appendChild(card);

            //CHANGE_TOTAL_PRICE
            const basketSumPrice = document.querySelector('.basket_sum_price'),
                  basketBenefitPrice = document.querySelector('.basket_benefit_price'),
                  basketTotalPrice = document.querySelector('.basket_total_price');
            basketSumPrice.textContent = '0';
            basketBenefitPrice.textContent = '0';
            basketTotalPrice.textContent = '0';
            let basket = JSON.parse(localStorage.getItem('basket_items'));
            for(let n = 0; n < basket.length; n++) {
                basketSumPrice.textContent = parseFloat(basketSumPrice.textContent) + 
                parseFloat(items[basket[n].id].price * basket[n].count);
                //benefitPrice.textContent += '0';
                basketTotalPrice.textContent = parseFloat(basketTotalPrice.textContent) + 
                parseFloat(items[basket[n].id].price * basket[n].count);
            }
            //CHANGE_TOTAL_PRICE

            
            





            //DELETE
            const pDelete = card.querySelector('.p_delete');
            pDelete.addEventListener('click', () => {
                itemsWrapper.removeChild(card);
                let basket;
                basket = JSON.parse(localStorage.getItem('basket_items'));
                for(let n = 0; n < basket.length; n++) {
                    if(basket[n].id === items[item.id].id) {
                        basket.splice(n, 1);
                    }
                }
                localStorage.setItem('basket_items', JSON.stringify(basket));

                //CHANGE_TOTAL_PRICE
                basketSumPrice.textContent = '0';
                basketBenefitPrice.textContent = '0';
                basketTotalPrice.textContent = '0';
                for(let n = 0; n < basket.length; n++) {
                    basketSumPrice.textContent = parseFloat(basketSumPrice.textContent) + 
                    parseFloat(items[basket[n].id].price * basket[n].count);
                    //benefitPrice.textContent += '0';
                    basketTotalPrice.textContent = parseFloat(basketTotalPrice.textContent) + 
                    parseFloat(items[basket[n].id].price * basket[n].count);
                }
                //CHANGE_TOTAL_PRICE
            });
            //DELETE

            //CHANGE_COUNT_DOWN
            let basketArrow = card.querySelector('.basket_down_button');
            basketArrow.addEventListener('click', () => {
                let basket;
                const numberButton = card.querySelector('.number-items'),
                      totalPrice = card.querySelector('.item_total_price');
                basket = JSON.parse(localStorage.getItem('basket_items'));
                for(let n = 0; n < basket.length; n++) {
                    if(basket[n].id === items[item.id].id) {
                        if (basket[n].count > 1) {
                            basket[n].count--;
                            numberButton.textContent = basket[n].count;
                            totalPrice.textContent = basket[n].count * items[item.id].price;
                        }
                    }
                }
                localStorage.setItem('basket_items', JSON.stringify(basket));

                //CHANGE_TOTAL_PRICE
                basketSumPrice.textContent = '0';
                basketBenefitPrice.textContent = '0';
                basketTotalPrice.textContent = '0';
                for(let n = 0; n < basket.length; n++) {
                    basketSumPrice.textContent = parseFloat(basketSumPrice.textContent) + 
                    parseFloat(items[basket[n].id].price * basket[n].count);
                    //benefitPrice.textContent += '0';
                    basketTotalPrice.textContent = parseFloat(basketTotalPrice.textContent) + 
                    parseFloat(items[basket[n].id].price * basket[n].count);
                }
                //CHANGE_TOTAL_PRICE
            });
            //CHANGE_COUNT_DOWN

            //CHANGE_COUNT_UP
            basketArrow = card.querySelector('.basket_up_button');
            basketArrow.addEventListener('click', () => {
                let basket;
                const numberButton = card.querySelector('.number-items'),
                      totalPrice = card.querySelector('.item_total_price');
                basket = JSON.parse(localStorage.getItem('basket_items'));
                for(let n = 0; n < basket.length; n++) {
                    if(basket[n].id === items[item.id].id) {
                        basket[n].count++;
                        numberButton.textContent = basket[n].count;
                        totalPrice.textContent = basket[n].count * items[item.id].price;
                    }
                }
                localStorage.setItem('basket_items', JSON.stringify(basket));

                //CHANGE_TOTAL_PRICE
                basketSumPrice.textContent = '0';
                basketBenefitPrice.textContent = '0';
                basketTotalPrice.textContent = '0';
                for(let n = 0; n < basket.length; n++) {
                    basketSumPrice.textContent = parseFloat(basketSumPrice.textContent) + 
                    parseFloat(items[basket[n].id].price * basket[n].count);
                    //benefitPrice.textContent += '0';
                    basketTotalPrice.textContent = parseFloat(basketTotalPrice.textContent) + 
                    parseFloat(items[basket[n].id].price * basket[n].count);
                }
                //CHANGE_TOTAL_PRICE
            });
            //CHANGE_COUNT_UP

        });

        //order_________________________________
        $('.basket_order_button').on('click', function(event) {
            event.preventDefault();
            localStorage.setItem('send_type', 'basket_order');
            $('.send_popup .main-form-btn').text('ОФОРМИТЬ ЗАКАЗ');
            $('.send_popup').show('fade', 300);
        });
        //end_order_________________________________






    }
}
// end корзина










//добавление событий на страницах
function actionPage(data) {

    //header____________________________________________
    let buf = document.querySelector('#header-woman');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'all');
    });
    buf = document.querySelector('#header-man');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'all');
    });
    buf = document.querySelector('#header-discont');
    buf.addEventListener('click', () => {
        localStorage.setItem('sale', 'true');
        localStorage.setItem('male', 'all');
        localStorage.setItem('category', 'all');
    //    filterFlag.category = 'all';
    });
    buf = document.querySelector('#header-basket');
    buf.addEventListener('click', () => {
    //    filterFlag.sale = true;
    });
    buf = document.querySelector('#header-like');
    buf.addEventListener('click', () => {
    //    filterFlag.sale = true;
    });



    buf = document.querySelector('#header-discont');
    buf.addEventListener('click', () => {
        localStorage.setItem('sale', 'true');
        localStorage.setItem('male', 'all');
        localStorage.setItem('category', 'all');
    //    filterFlag.category = 'all';
    });

    $(document).ready(function() {
        $('#burger-btn').on('click', function(event) {
          event.preventDefault();

          const menuA = document.querySelectorAll('.clear_p');
          menuA.forEach((p) => {
            p.textContent = '0';
          });
          data.items.forEach((item) => {
            if (item.male === 'man') {
                switch(item.category) {
                    case 'Сумки':
                        $('#menu_man_sum').text( (parseFloat($('#menu_man_sum').text()) + 1) );
                    break;
                  
                    case 'Саквояжи':
                        $('#menu_man_sac').text( (parseFloat($('#menu_man_sac').text()) + 1) );
                    break;
                      
                    case 'Дорожные сумки':
                        $('#menu_man_dor_sum').text( (parseFloat($('#menu_man_dor_sum').text()) + 1) );
                    break;
                
                    case 'Портфели':
                        $('#menu_man_por').text( (parseFloat($('#menu_man_por').text()) + 1) );
                    break;
                    
                    case 'Рюкзаки':
                        $('#menu_man_ruc').text( (parseFloat($('#menu_man_ruc').text()) + 1) );
                    break;
                    
                    case 'Клатчи':
                        $('#menu_man_cla').text( (parseFloat($('#menu_man_cla').text()) + 1) );
                    break;

                    case 'Портмоне':
                        $('#menu_man_port').text( (parseFloat($('#menu_man_port').text()) + 1) );
                    break;
                  }
            } else if (item.male === 'woman') {
                switch(item.category) {
                    case 'Сумки':
                      $('#menu_woman_sum').text( (parseFloat($('#menu_woman_sum').text()) + 1) );
                    break;
                  
                    case 'Саквояжи':
                        $('#menu_woman_sac').text( (parseFloat($('#menu_woman_sac').text()) + 1) );
                    break;
                    
                    case 'Рюкзаки':
                        $('#menu_woman_ruc').text( (parseFloat($('#menu_woman_ruc').text()) + 1) );
                    break;
                    
                    case 'Клатчи':
                        $('#menu_woman_cla').text( (parseFloat($('#menu_woman_cla').text()) + 1) );
                    break;

                    case 'Портмоне':
                        $('#menu_man_port').text( (parseFloat($('#menu_woman_port').text()) + 1) );
                    break;
                  }
            }
          });
        //  $('.popup-menu').effect('drop', 'up show', 1000).fadeIn();
          $('.popup-menu').show('drop', 'up', 'show', 600);
        });

        $('#back-menu').on('click', function(event) {
          event.preventDefault();
          $('.popup-menu').hide('drop', 'up', 'show', 1000);
        });
    });


    buf = document.querySelector('#menu_man');
    buf.addEventListener('click', () => {
        const wrapper = document.querySelector('.man-content-menu');
        if (wrapper.style.display === '') {
            wrapper.style.display = 'block';
        } else {
            wrapper.style.display = '';
        }
    });

    buf = document.querySelector('#menu_woman');
    buf.addEventListener('click', () => {
        const wrapper = document.querySelector('.woman-content-menu');
        if (wrapper.style.display === '') {
            wrapper.style.display = 'block';
        } else {
            wrapper.style.display = '';
        }
    });


    //MENU____________________________________________
    //man_____________________________________________
    $('#a_menu_man_sum').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Сумки');
    });

    $('#a_menu_man_sac').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Саквояжи');
    });

    $('#a_menu_man_dor_sum').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Дорожные сумки');
    });

    $('#a_menu_man_por').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Потрфели');
    });

    $('.man-content-menu #a_menu_man_ruc').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Рюкзаки');
    });

    $('#a_menu_man_cla').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Клатчи');
    });

    $('#a_menu_man_port').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Портмоне');
    });

    //woman_____________________________________________
    $('#a_menu_woman_sum').on('click', function(event) {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Сумки');
    });

    $('#a_menu_woman_sac').on('click', function(event) {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Саквояжи');
    });

    $('#a_menu_woman_ruc').on('click', function(event) {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Рюкзаки');
    });

    $('#a_menu_woman_cla').on('click', function(event) {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Клатчи');
    });

    $('#a_menu_woman_port').on('click', function(event) {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Портмоне');
    });




        //SUBMENU_LI______________________________________
    //man_____________________________________________
    $('#li_menu_man_sum').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Сумки');
    });

    $('#li_menu_man_sac').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Саквояжи');
    });

    $('#li_menu_man_dor_sum').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Дорожные сумки');
    });

    $('#li_menu_man_por').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Потрфели');
    });

    $('#li_menu_man_ruc').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Рюкзаки');
    });

    $('#li_menu_man_cla').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Клатчи');
    });

    $('#li_menu_man_port').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Портмоне');
    });

    //woman_____________________________________________
    $('#li_menu_woman_sum').on('click', function(event) {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Сумки');
    });

    $('#li_menu_woman_sac').on('click', function(event) {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Саквояжи');
    });

    $('#li_menu_woman_ruc').on('click', function(event) {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Рюкзаки');
    });

    $('#li_menu_woman_cla').on('click', function(event) {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Клатчи');
    });

    $('#li_menu_woman_port').on('click', function(event) {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Портмоне');
    });

    
    //end_header________________________________________

    //sections__________________________________________

    //index_____________________________________
    if ((document.location.href).substr(document.location.href.length - 10) == "index.html") {
        buf = document.querySelector('#index-man');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'all');
        document.location.href = "items.html";
    });

    buf = document.querySelector('#index-woman');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'all');
        document.location.href = "items.html";
    });


    buf = document.querySelector('.subscribe-input');
    buf.addEventListener('click', () => {
        const subWrapper = document.querySelector('.set_sub');
        subWrapper.style.display = 'block';
    });
    
    buf = document.querySelector('.subscribe-button');
    buf.addEventListener('click', () => {
        const subWrapper = document.querySelector('.set_sub'),
              inpBtnWrapper = document.querySelector('.set_inp_btn'),
              checkMan =  document.querySelector('#check_man'),
              checkWoman =  document.querySelector('#check_woman'),
              checkAgree =  document.querySelector('#check_agree');
              
              let isValid = ($('#input_sub').val().match(/.+?\@.+/g) || []).length === 1;

        if (isValid && checkAgree.checked && (checkMan.checked || checkWoman.checked)) {
            $('.header_thx').text('СПАСИБО!');
            $('.text_thx').text('Вы успешно подписаны на нашу новостную рассылку.');

            
            //SUBSCRIBE________________________________________________________________________
            //SUBSCRIBE________________________________________________________________________


            inpBtnWrapper.style.display = 'none';
            subWrapper.style.display = 'none';
        }
    });








    }
    //end_index_________________________________




    // items____________________________________
    if ((document.location.href).substr(document.location.href.length - 10) == "items.html") {

        const discount =  document.querySelector('#items-discount');
        discount.addEventListener('click', () => {
            if (localStorage.getItem('sale') === 'false') {
                localStorage.setItem('sale', 'true');
            } else {
                localStorage.setItem('sale', 'false');
            }
            location.reload();
        });
        const sortMax =  document.querySelector('#items-sort-max-price');
        const sortMin =  document.querySelector('#items-sort-min-price');
        sortMax.addEventListener('click', () => {
            if (!(localStorage.getItem('sort') === 'max')) {
                localStorage.setItem('sort', 'max');
            } else {
                localStorage.setItem('sort', 'none');
            }
            location.reload();
        });
        sortMin.addEventListener('click', () => {
            if (!(localStorage.getItem('sort') === 'min')) {
                localStorage.setItem('sort', 'min');
            } else {
                localStorage.setItem('sort', 'none');
            }
            location.reload();
        });
        
        
        
    }



    //Category_nav actions___________________________________
    //man_____________________________________________
    $('#nav_menu_man_sum').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Сумки');
    });

    $('#nav_menu_man_sac').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Саквояжи');
    });

    $('#nav_menu_man_dor_sum').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Дорожные сумки');
    });

    $('#nav_menu_man_por').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Потрфели');
    });

    $('#nav_menu_man_ruc').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Рюкзаки');
    });

    $('#nav_menu_man_cla').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Клатчи');
    });

    $('#nav_menu_man_port').on('click', function(event) {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Портмоне');
    });

    //woman_____________________________________________
    $('#nav_menu_woman_sum').on('click', function(event) {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Сумки');
    });

    $('#nav_menu_woman_sac').on('click', function(event) {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Саквояжи');
    });

    $('#nav_menu_woman_ruc').on('click', function(event) {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Рюкзаки');
    });

    $('#nav_menu_woman_cla').on('click', function(event) {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Клатчи');
    });

    $('#nav_menu_woman_port').on('click', function(event) {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Портмоне');
    });
    //Category_nav actions_________________________________

    //end_items_________________________________





    //end_sections_____________________________________


    //footer___________________________________

    //woman
    buf = document.querySelector('#footer-woman');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'all');
    });
    buf = document.querySelector('#footer-woman-sum');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Сумки');
    });
    buf = document.querySelector('#footer-woman-sac');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Саквояжи');

    });
    buf = document.querySelector('#footer-woman-ruc');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Рюкзакиl');
    });
    buf = document.querySelector('#footer-woman-cla');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Клатчи');
    });
    buf = document.querySelector('#footer-woman-por');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'woman');
        localStorage.setItem('category', 'Портмоне');
    });

    //man
    buf = document.querySelector('#footer-man');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'all');
    });
    buf = document.querySelector('#footer-man-sum');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Сумки');
    });
    buf = document.querySelector('#footer-man-sac');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Саквояжи');
    });
    buf = document.querySelector('#footer-man-dor-sum');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Дорожные сумки');
    });
    buf = document.querySelector('#footer-man-por');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Портфели');
    });

    buf = document.querySelector('#footer-man-ruc');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Рюкзаки');
    });
    buf = document.querySelector('#footer-man-cla');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Клатчи');
    });
    buf = document.querySelector('#footer-man-port');
    buf.addEventListener('click', () => {
        localStorage.setItem('male', 'man');
        localStorage.setItem('category', 'Портмоне');
    });

    //col-3____________

    //buttons__________
    $('#call_us_btn').on('click', function(event) {
        event.preventDefault();
        localStorage.setItem('send_type', 'call_us');
        $('.send_popup').show('fade', 300);
      });

      $('#feedback_btn').on('click', function(event) {
        event.preventDefault();
        localStorage.setItem('send_type', 'feedback');
        $('.feedback_popup').show('fade', 300);
      });

      $('.send_popup-close').on('click', function(event) {
        event.preventDefault();
        $('.send_popup').hide('fade', 300);
      });

      $('.feedback_popup-close').on('click', function(event) {
        event.preventDefault();
        $('.feedback_popup').hide('fade', 300);
      });
    //buttons__________

    //end_footer______________________________________


    //SEND_MAIL_______________________________________
    $('form').submit(async (event) => {
        event.preventDefault();
        const sendType = localStorage.getItem('send_type');

        // $.ajax({
        //     type: $(this).attr('method'),
        //     url: $(this).attr('action'),
        //     data: new FormData(this),
        //     contentType: false,
        //     cache: false,
        //     processData: false,
        //     success: function(result) {
        //         alert(result);
        //     }
        // });

        // switch(sendType) {
        //     case 'call_us':
              
        //     break;
          
        //     case 'feedback':
            
        //     break;
              
        //     case 'order':
            
        //     break;

        //     case 'basket_order':
            
        //     break;
        // }




        // const form = document.querySelector('.send_form');
        // console.log(form);

        // let formData =  new FormData(form);
        // formData.append('message', 'Привет, красавчик!');

        // let response = await fetch('vasc10ac@gmail.com', {
        //     method: 'POST',
        //     body: formData,
        // });
        
        // let result = await response.text();

        // alert(result.message);









       $('.popup').hide('fade', 300);



       $('.thx_popup').show('fade', 300);
       $('.popup-close').on('click', function(event) {
        event.preventDefault();
        $('.popup').hide('fade', 300);
      });
      });

    //SEND_MAIL_______________________________________

}
//end добавление событий на страницах












// getData().then((data) => {
//     renderCards(data);
//     renderCatalog();
//     toggleCheckBox();
//     toggleCart();
//     addCart();
//     actionPage();
// });

//Ассинхронная функция
(async function(){
    const db = await getData();
    console.log(db);
    if (localStorage.getItem('basket_items') == null) {
        localStorage.setItem('basket_items', '');
    }
    if (localStorage.getItem('count_items') == null) {
        localStorage.setItem('count_items', '9');
    }
    //console.log((document.location.href).substr(document.location.href.length - 10));
    if ((document.location.href).substr(document.location.href.length - 10) == "items.html") {
        renderItems(db);
        //filterItems(db);
    }
    if ((document.location.href).substr(document.location.href.length - 11) == "detail.html") {
        renderDetail(db);
        //filterItems(db);
    }
    if ((document.location.href).substr(document.location.href.length - 11) == "basket.html") {
        renderBasket(db);
        //filterItems(db);
    }
    actionPage(db);




    
 //   actionPage();
    
    // renderCatalog();
    // toggleCheckBox();
    // toggleCart();
    // addCart();
    // actionPage();
}());

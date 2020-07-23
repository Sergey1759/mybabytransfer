document.addEventListener("DOMContentLoaded", () => {
  let auto_krislo = document.getElementById("auto_krislo");
  (() => {
    let back_child = document.getElementsByClassName("back_child");
    for (const iterator of back_child) {
      let id = iterator.dataset.id;
      let option = iterator.dataset.option;
      let html_option = create_option(option);
      auto_krislo.insertAdjacentHTML(
        "afterEnd",
        create_child2(id, html_option)
      );
    }
  })();

  let btn_auto = document.getElementById("btn_auto");

  let btn_r = document.getElementById("btn_r");

  let data = {};
  let new_select = 0;

  function create_child() {
    return `
        <label>
        <div class="container_row">
            <div class="container_row_icon">
                <img src="../../images/baby.svg" alt="">
            </div>
            <div class="container_row_right">
                <div class="container_row_text">
                    Возраст ребенка в автокресле:
                </div>
                <div class="container_row_value ">
                    <select name="age_child" id="new_${++new_select}">
                        <option value="1" title="0-13 кг">От рождения до 1 года</option>
                        <option value="2" title="9-18 кг">От 9 месяцев до 4 лет</option>
                        <option value="3" title="15-25 кг">От 3 до 7 лет</option>
                        <option value="4" title="22-36 кг">От 6 до 12 лет</option>
                    </select>
                </div>
            </div>
        </div>
        </label>
        `;
  }

  function create_option(option) {
    let obj = {
      1: function (is) {
        let selected = is == true ? "selected" : "";
        return `<option value="1" title="0-13 кг" ${selected} >От рождения до 1 года</option>`;
      },
      2: function (is) {
        let selected = is == true ? "selected" : "";
        return `<option value="2" title="9-18 кг" ${selected} >От 9 месяцев до 4 лет</option>`;
      },
      3: function (is) {
        let selected = is == true ? "selected" : "";
        return `<option value="3" title="15-25 кг" ${selected} >От 3 до 7 лет</option>`;
      },
      4: function (is) {
        let selected = is == true ? "selected" : "";
        return `<option value="4" title="22-36 кг" ${selected} >От 6 до 12 лет</option>`;
      },
    };
    let str = "";
    for (const iterator in obj) {
      if (iterator == +option) {
        str += obj[iterator](true);
      } else {
        str += obj[iterator](false);
      }
    }
    return str;
  }

  function create_child2(id, options) {
    return `
        <label>
        <div class="container_row">
            <div class="container_row_icon">
                <img src="../../images/baby.svg" alt="">
            </div>
            <div class="container_row_right">
                <div class="container_row_text">
                    Возраст ребенка в автокресле:
                </div>
                <div class="container_row_value ">
                    <select name="age_child" id="back_${id}">
                        ${options}
                    </select>
                </div>
            </div>
        </div>
        </label>
        `;
  }

  btn_auto.addEventListener("click", () => {
    auto_krislo.insertAdjacentHTML("afterEnd", create_child());
  });

  btn_r.addEventListener("click", async () => {
    let elements_user = getId(
      "name",
      "lastname",
      "city",
      "number_auto",
      "description_auto",
      "bank_card",
      "price_1"
    );

    let elements_auto = getId("number_auto", "description_auto", "price_1");
    let elements_time = getId(
      "start_working",
      "stop_working",
      "pause_from",
      "pause_to"
    );

    let user = {};
    let auto = {};
    let time = {};
    for (const iterator in elements_user) {
      isEmpty(elements_user[iterator], user);
    }
    for (const iterator in elements_auto) {
      isEmpty(elements_auto[iterator], auto);
    }
    for (const iterator in elements_time) {
      isEmpty(elements_time[iterator], time);
    }
    console.log(time);
    let type_auto = document.getElementById("type_auto");
    auto.type_auto = type_auto.options[type_auto.selectedIndex].value;

    data.user = user;
    data.auto = auto;
    data.time = time;
    let age_child = document.getElementsByName("age_child");
    let selects_child = [];
    for (const iterator of age_child) {
      selects_child.push({
        id: iterator.id,
        value: iterator.options[iterator.selectedIndex].value,
      });
    }
    data.child = selects_child;
    console.log(selects_child);
    let res = await postData("/driver/profile/", data);
  });

  function getId(...elements) {
    let obj = {};
    for (const iterator of elements) {
      obj[iterator] = document.getElementById(iterator);
    }
    return obj;
  }

  function isEmpty(el, obj) {
    if (el.value != "") {
      obj[el.id] = el.value;
    }
  }
});

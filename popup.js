
function ejection() {
    chrome.tabs.query({active: true}, function(tabs) {
        var tab = tabs[0];
        if (tab) {
            chrome.scripting.executeScript(
                {
                    target:{tabId: tab.id, allFrames: true},
                    func:grabImages
                },
                onResult
            )
        } else {
            alert("There are no active tabs")
        }
    })  
}

ejection()

/**
 * Получает список абсолютных путей всех картинок
 * на удаленной странице
 * 
 *  @return Array Массив URL
 */
function grabImages() {
    str = document.getSelection().toString();
    return str;
}

function extractSpecs(text) {
    const toRemove = ["SLOT1", "SLOT2", "SLOTA"];
    const regexp = /(sl\w\w\w)/gi;
    const array = [...text.matchAll(regexp)];
    const result = array.map((x) => x[0]);
    // console.log(result);
    // alert(JSON.stringify(result));
    const filtered_result = result.filter( function( el ) {
        return !toRemove.includes( el.toUpperCase() );
      } );
    return filtered_result;
}

/**
 * Выполняется после того как вызовы grabImages 
 * выполнены во всех фреймах удаленной web-страницы.
 * Функция объединяет результаты в строку и копирует  
 * список путей к изображениям в буфер обмена
 * 
 * @param {[]InjectionResult} frames Массив результатов
 * функции grabImages
 */
function onResult(frames) {
    // Если результатов нет
    if (!frames || !frames.length) { 
        alert("Could not retrieve images from specified page");
        return;
    }
    // Объединить списки URL из каждого фрейма в один массив
    const imageUrls = frames.map(frame=>frame.result).reduce((r1,r2)=>r1.concat(r2));
    // alert(JSON.stringify(imageUrls));
    // Скопировать в буфер обмена полученный массив  
    // объединив его в строку, используя возврат каретки 
    // как разделитель  
    specs = extractSpecs(imageUrls);
    document.getElementById("spec-list").innerHTML = JSON.stringify(specs);
    window.navigator.clipboard.writeText(specs.join("\n"));
}

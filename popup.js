const grabBtn = document.getElementById("grabBtn");

grabBtn.addEventListener("click",() => {    
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
})


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
    const regexp = /(sl...)/gi;
    const array = [...text.matchAll(regexp)];
    const result = array.map((x) => x[0]);
    console.log(result);
    alert(JSON.stringify(result));
    return result;
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
    alert(JSON.stringify(imageUrls));
    // Скопировать в буфер обмена полученный массив  
    // объединив его в строку, используя возврат каретки 
    // как разделитель  
    extractSpecs(imageUrls);
    window.navigator.clipboard
          .writeText(imageUrls)
          .then(()=>{
             // закрыть окно расширения после 
             // завершения
             window.close();
          });
}

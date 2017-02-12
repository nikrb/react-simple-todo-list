
function LocalDB(){
  let that = {};
  let idb = null;
  const init = () => {
    const promise = new Promise( (resolve, reject) => {
      const open = window.indexedDB.open("todoDB", 1);
      open.onupgradeneeded = () => {
        idb = open.result;
        idb.createObjectStore( "todoDB", { keyPath: "date"});
      };
      open.onsuccess = () => {
        idb = open.result;
        resolve( true);
        // we don't want to close db here!
        // tx.oncomplete = () => {
        //   db.close();
        // };
      };
    });
    return promise;
  }
  const createTodo = ( text) => {
    const promise = new Promise( ( resolve, reject) => {
      const tx = idb.transaction( "todoDB", "readwrite");
      const store = tx.objectStore( "todoDB");
      store.add( { date: new Date(), text: text})
      .onsuccess = (event) => {
        resolve( event.target.result);
      };
    });
    return promise;
  };
  const getTodos = () => {
    // TODO: suppose idb isn't set when we call this?
    const promise = new Promise( ( resolve, reject) => {
      const tx = idb.transaction( "todoDB", "readonly");
      const store = tx.objectStore( "todoDB");
      let todo_list = [];
      store.openCursor().onsuccess = (event) => {
        const cur = event.target.result;
        if( cur){
          todo_list.push( cur.value);
          cur.continue();
        } else {
          resolve( todo_list);
        }
      };
    });
    return promise;
  }
  const close = () => {
    idb.close();
  };
  that.init = init;
  that.close = close;
  that.getAll = getTodos;
  that.createTodo = createTodo;
  return that;
}

export default LocalDB();

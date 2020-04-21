import { openDB } from 'idb/with-async-ittr.js';

async function demo() {
  const db = await openDB('Articles', 2, {
    upgrade(db) {
      const store = db.createObjectStore('articles', {
        keyPath: 'id',
        autoIncrement: true
      });

      store.createIndex('date', 'date');

      // Add multiple articles in one transaction:
      store.transaction.oncomplete = async function(event) {
        const tx = db.transaction('articles', 'readwrite');
        tx.store.add({
          title: 'Article 2',
          date: new Date('2019-01-01'),
          body: '…',
        });
        tx.store.add({
          title: 'Article 3',
          date: new Date('2019-01-02'),
          body: '…',
        });
        await tx.done;
      }
    }
  });

  console.log(await db.getAll('articles'));
}

demo();
import {createUser} from "../services/users-service";
import {
    createTuit,
    deleteTuit,
    deleteTuitByUserId,
    findTuitById,
    findAllTuits,
    findTuitByUser
} from "../services/tuits-service"
import {deleteUsersByUsername} from "./services";

describe('can create tuit with REST API', () => {
 const ripley = {
        username: 'ellenripley',
        password: 'lv426',
        email: 'ellenripley@aliens.com'
    };
    const tuitText = 'Some random text on the tuit';
    const currDate = new Date("2022-03-17T11:48:48.360Z");
    let userId;
    let newUser;
    let tuit;

    beforeEach(async () => {
        newUser = await createUser(ripley);
        userId = newUser._id;
    });

    afterEach(async () => {
        await deleteTuit(tuit._id);
        const response = await deleteUsersByUsername(ripley.username);
    });

    test('can create tuit with REST API', async () => {
        const newTuit = {
            tuit: tuitText,
            postedOn: currDate,
            postedBy: newUser,
        };
        tuit = await createTuit(userId, newTuit);

        expect(tuit.tuit).toEqual(tuitText);
        expect(tuit.postedOn).toEqual("2022-03-17T11:48:48.360Z");
        expect(tuit.postedBy).toEqual(userId);
    });
});

describe('can delete tuit wtih REST API', () => {
 const ripley = {
         username: 'ellenripley',
         password: 'lv426',
         email: 'ellenripley@aliens.com'
     };
     const tuitText = 'Some random text on the tuit';
     const currDate = new Date("2022-03-17T11:48:48.360Z");

     let userId, newUser, tuit;
     beforeEach(async () => {
         newUser = await createUser(ripley);
         userId = newUser._id;

         const newTuit = {
             tuit: tuitText,
             postedOn: currDate,
             postedBy: newUser,
         };
         tuit = await createTuit(userId, newTuit);
     });

     afterEach(async () => {
         await deleteTuit(tuit._id);
         const response = await deleteUsersByUsername(ripley.username);
     });

     test('can delete tuit wtih REST API by tuitid', async () => {
         const status = await deleteTuit(tuit._id);

         expect(status.deletedCount).toBeGreaterThanOrEqual(1);
     });

     test('can delete tuit with REST API by userid', async () => {
         const status = await deleteTuitByUserId(userId);

         expect(status.deletedCount).toBeGreaterThanOrEqual(1);
     });
});

describe('can retrieve a tuit by their primary key with REST API', () => {
  const ripley = {
          username: 'ellenripley',
          password: 'lv426',
          email: 'ellenripley@aliens.com'
      };
      const tuitText = 'Some random text on the tuit';
      const currDate = new Date("2022-03-17T11:48:48.360Z");

      let userId, newUser, tuit;
      beforeEach(async () => {
          newUser = await createUser(ripley);
          userId = newUser._id;

          const newTuit = {
              tuit: tuitText,
              postedOn: currDate,
              postedBy: newUser,
          };
          tuit = await createTuit(userId, newTuit);
      });

      afterEach(async () => {
          await deleteTuit(tuit._id);
          await deleteUsersByUsername(ripley.username);
      });

      test('can retrieve a tuit by their primary key with REST API', async () => {
          const tuitResponse = await findTuitById(tuit._id);

          expect(tuitResponse._id).toEqual(tuit._id);
          expect(tuitResponse.tuit).toEqual(tuitText);
          expect(tuitResponse.postedOn).toEqual("2022-03-17T11:48:48.360Z");
          expect(tuitResponse.postedBy).toEqual(userId);
      });
});

describe('can retrieve all tuits with REST API', () => {
  const tuitTexts = ['random text 1', 'random text 2', 'random text 3'];
      const tuitIds = [];
      const ripley = {
          username: 'ellenripley',
          password: 'lv426',
          email: 'ellenripley@aliens.com'
      };
      const tuitText = 'Some random text on the tuit';
      const currDate = new Date("2022-03-17T11:48:48.360Z");

      let userId, newUser, tuit;
      beforeEach(async () => {
          newUser = await createUser(ripley);
          userId = newUser._id;

          for (const text of tuitTexts) {
              let newTuit = {
                  tuit: text,
                  postedOn: currDate,
                  postedBy: newUser,
              };
              tuit = await createTuit(userId, newTuit);
              tuitIds.push(tuit._id);
          }
      });

      afterEach(async () => {
          for (const id of tuitIds) {
              await deleteTuit(id);
          }
          await deleteUsersByUsername(ripley.username);
      });

      test('can retrieve all tuits with REST API', async () => {
          const tuitResponse = await findAllTuits();

          expect(tuitResponse.length).toBeGreaterThanOrEqual(tuitTexts.length);
          const textsRetreived = tuitResponse.map(tuit => tuit.tuit);
          for (const text of tuitTexts) {
              expect(textsRetreived.includes(text)).toEqual(true);
          }
      });
});
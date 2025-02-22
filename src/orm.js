import { getDatabase, ref, query, orderByChild, equalTo, get } from "firebase/database";

const database = getDatabase();
const uID = "asd239f293d"; 

async function FetchAllRoutes(db = database, userId = uID) {
    
    const routesQuery = query(ref(db, "ROUTES"), orderByChild("createdBy"), equalTo(userId));

    get(routesQuery).then((instance) => {
    if (instance.exists()) {
        console.log("Routes:", instance.val());
    }
    });

}
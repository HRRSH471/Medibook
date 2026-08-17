module.exports = async function (context, req) {

    context.log("Fetching hospitals from Cosmos DB");

    try {

        // Doctors container se hospitals already unique form mein aa rahe hain
        const hospitals = context.bindings.hospitals || [];

        context.res = {
            status: 200,

            headers: {
                "Content-Type": "application/json"
            },

            body: {
                success: true,
                count: hospitals.length,
                hospitals: hospitals
            }
        };

    } catch (error) {

        context.log.error(
            "Error fetching hospitals:",
            error
        );

        context.res = {
            status: 500,

            body: {
                success: false,
                message: "Internal server error"
            }
        };
    }
};
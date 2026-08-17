module.exports = async function (context, req) {

    context.log("Patient registration request received");

    try {

        const patient = req.body;

        // Request body validation
        if (!patient) {
            context.res = {
                status: 400,
                body: {
                    success: false,
                    message: "Request body is required"
                }
            };
            return;
        }

        // Get patient fields
        const {
            name,
            email,
            phone
        } = patient;

        // Required fields validation
        if (
            !name ||
            !email ||
            !phone
        ) {
            context.res = {
                status: 400,
                body: {
                    success: false,
                    message: "name, email and phone are required"
                }
            };
            return;
        }

        // Create patient document
        const patientDocument = {
            id: Date.now().toString(),

            name: name.trim(),

            email: email.trim().toLowerCase(),

            phone: phone.trim(),

            createdAt: new Date().toISOString()
        };

        // Send document to Cosmos DB
        context.bindings.patientDocument = patientDocument;

        // Success response
        context.res = {
            status: 201,
            body: {
                success: true,
                message: "Patient registered successfully",
                patient: patientDocument
            }
        };

    } catch (error) {

        context.log.error(
            "Patient registration error:",
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
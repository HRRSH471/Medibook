module.exports = async function (context, req) {

    context.log("Doctor registration request received");

    try {

        const doctor = req.body;

        // Request body validation
        if (!doctor) {
            context.res = {
                status: 400,
                body: {
                    success: false,
                    message: "Request body is required"
                }
            };
            return;
        }

        // Get fields from request
        const {
            name,
            specialization,
            hospitalName,
            hospitalId,
            email
        } = doctor;

        // Required fields validation
        if (
            !name ||
            !specialization ||
            !hospitalName ||
            !hospitalId ||
            !email
        ) {
            context.res = {
                status: 400,
                body: {
                    success: false,
                    message:
                        "name, specialization, hospitalName, hospitalId and email are required"
                }
            };
            return;
        }

        // Create doctor document
        const doctorDocument = {
            id: Date.now().toString(),

            name: name.trim(),

            specialization: specialization.trim(),

            hospitalName: hospitalName.trim(),

            hospitalId: hospitalId.trim(),

            email: email.trim().toLowerCase(),

            createdAt: new Date().toISOString()
        };

        // Send document to Cosmos DB
        context.bindings.doctorDocument = doctorDocument;

        // Success response
        context.res = {
            status: 201,
            body: {
                success: true,
                message: "Doctor registered successfully",
                doctor: doctorDocument
            }
        };

    } catch (error) {

        context.log.error(
            "Doctor registration error:",
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
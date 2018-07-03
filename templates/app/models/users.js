const Sequelize = require('sequelize');

module.exports = (db) => {
	const users = db.define('users', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		user_profile_img: {
			type: Sequelize.STRING,
		},
		is_admin: {
			type: Sequelize.INTEGER,
		},
		user_name: {
			type: Sequelize.STRING,
		},
		user_account_status: {
			type: Sequelize.INTEGER,
		},
		user_level: {
			type: Sequelize.INTEGER,
		},
		user_description: {
			type: Sequelize.STRING,
		},
		user_category: {
			type: Sequelize.STRING,
		},
		following_count: {
			type: Sequelize.INTEGER,
		},
		follower_count: {
			type: Sequelize.INTEGER,
		},
		is_live: {
			type: Sequelize.INTEGER,
		},
		total_broad_pd: {
			type: Sequelize.INTEGER,
		},
		total_broad_watch: {
			type: Sequelize.INTEGER,
		},
		seller_contract_id: {
			type: Sequelize.STRING,
		},
		commerce_seller_id: {
			type: Sequelize.STRING,
		},
		sex: {
			type: Sequelize.STRING,
		},
		age: {
			type: Sequelize.STRING,
		},
		contact_number: {
			type: Sequelize.STRING,
		},
		email: {
			type: Sequelize.STRING,
		},
		bank_owner_name: {
			type: Sequelize.STRING,
		},
		bank_account: {
			type: Sequelize.STRING,
		},
		sign_up_flow: {
			type: Sequelize.STRING,
		},
		country: {
			type: Sequelize.STRING,
		},
		receive_alarm: {
			type: Sequelize.STRING,
		},
		is_deleted: {
			type: Sequelize.STRING,
		},
		created_at: {
			type: Sequelize.DATE,
		},
		updated_at: {
			type: Sequelize.DATE,
		},
	}, {
		validations: {},
		methods: {},
		tableName: 'users',
		timestamps: false,
		underscored: false
	});

	users.associate = models => {
		users.hasMany(models.purses, {through: models.purses.user_id, foreignKey: "id"});
    }

	return users;
};
# Click Counter Server-Side Setup

This document explains how to set up and maintain the persistent click counter feature on your VPS.

## How It Works

The click counter uses a simple JSON file (`clicks.json`) to store the total number of eye clicks across all users. Two API endpoints handle the functionality:

- `/api/getClicks.json` - Retrieves the current count
- `/api/updateClicks.json` - Increments the count

## Initial Setup

1. **Create the storage file**:
   ```bash
   echo '{"clicks": 0}' > /var/www/portfolio_live/clicks.json
   ```

2. **Set proper permissions**:
   ```bash
   chmod 666 /var/www/portfolio_live/clicks.json
   ```

3. **Make sure Astro can access the file**:
   The API endpoints look for `clicks.json` in the project root. Ensure your Node.js process has read/write permissions to this file.

## Persistence After Deploys

The current deployment script replaces all files in the `/var/www/portfolio_live/` directory, which would overwrite the click counter data. To fix this:

1. **Modify your deploy script** to preserve the clicks.json file:
   ```bash
   # Add this line before the rm -rf command in deploy.sh
   cp /var/www/portfolio_live/clicks.json /tmp/clicks.json.backup || true
   
   # Add this line after the cp -R command
   cp /tmp/clicks.json.backup /var/www/portfolio_live/clicks.json || echo '{"clicks": 0}' > /var/www/portfolio_live/clicks.json
   ```

2. **Alternative approach**: Store clicks.json outside the web directory:
   ```bash
   # Store outside web directory
   echo '{"clicks": 0}' > /var/www/click_data/clicks.json
   chmod 666 /var/www/click_data/clicks.json
   
   # Create a symlink
   ln -s /var/www/click_data/clicks.json /var/www/portfolio_live/clicks.json
   ```

## Troubleshooting

1. **Counter shows "Loading..." indefinitely**:
   - Check API endpoint responses: `curl https://yourdomain.com/api/getClicks.json`
   - Verify file permissions: `ls -la /var/www/portfolio_live/clicks.json`

2. **Errors in server logs**:
   - Check Node.js/Astro logs for file access errors
   - Ensure your web server user (often `www-data`) can read/write the file

3. **Counter resets after deployment**:
   - Confirm the persistence steps above are working
   - Check if backup/restore commands are executing properly

## Security Considerations

This implementation is intentionally simple with minimal security concerns. However:

1. There's no rate limiting on the update endpoint, meaning someone could spam clicks
2. The click count could be manipulated by directly editing the JSON file
3. For a production-grade solution, consider using a proper database

If these concerns are important, consider upgrading to a database-backed solution or implementing rate limiting on the API endpoints.